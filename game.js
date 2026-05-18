"use strict";

/* ═══════════════════════════════════════════════
   BFS SOLVER — verifies every level is solvable
   and returns minimum move count.
   ═══════════════════════════════════════════════ */
function bfsSolve(levelDef, allPeople) {
  const chars = levelDef.characters.map((id) => allPeople.find((p) => p.id === id));
  const cap = levelDef.boatCapacity;
  const cons = levelDef.constraints;

  function stateKey(sides, boat) {
    return sides.join("") + boat;
  }

  function isSafe(group) {
    const types = new Set(group.map((p) => p.type));
    const ids = new Set(group.map((p) => p.id));
    if (cons.fatherDaughter && types.has("father") && types.has("daughter") && !types.has("mother")) return false;
    if (cons.motherSon && types.has("mother") && types.has("son") && !types.has("father")) return false;
    if (cons.dogMaid && ids.has("dog") && !ids.has("maid") && group.some((p) => p.type !== "dog")) return false;
    return true;
  }

  function isBoatSafe(passengers) {
    if (passengers.length < 2) return true;
    return isSafe(passengers);
  }

  // sides[i] = "L" or "R"
  const initSides = chars.map(() => "L");
  const initKey = stateKey(initSides, "L");
  const queue = [{ sides: initSides, boat: "L", moves: 0 }];
  const visited = new Set([initKey]);

  while (queue.length) {
    const { sides, boat, moves } = queue.shift();

    // Goal: all on right
    if (sides.every((s) => s === "R")) return moves;

    const fromSide = boat;
    const toSide = fromSide === "L" ? "R" : "L";

    // Collect people on the boat's side
    const onSide = chars.map((c, i) => (sides[i] === fromSide ? i : -1)).filter((i) => i >= 0);

    // Generate all valid subsets (1..cap) that include a driver
    const subsets = [];
    const n = onSide.length;
    for (let mask = 1; mask < 1 << n; mask++) {
      const group = [];
      for (let b = 0; b < n; b++) {
        if (mask & (1 << b)) group.push(onSide[b]);
      }
      if (group.length > cap) continue;
      const passengers = group.map((i) => chars[i]);
      if (!passengers.some((p) => p.driver)) continue;
      if (!isBoatSafe(passengers)) continue;
      subsets.push(group);
    }

    for (const group of subsets) {
      const newSides = [...sides];
      group.forEach((i) => (newSides[i] = toSide));

      // Check both banks
      const leftGroup = chars.filter((_, i) => newSides[i] === "L");
      const rightGroup = chars.filter((_, i) => newSides[i] === "R");
      if (!isSafe(leftGroup) || !isSafe(rightGroup)) continue;

      const key = stateKey(newSides, toSide);
      if (visited.has(key)) continue;
      visited.add(key);
      queue.push({ sides: newSides, boat: toSide, moves: moves + 1 });
    }
  }

  return null; // unsolvable
}

/* ═══════════════════════════════════════════════
   PEOPLE MASTER DATA
   ═══════════════════════════════════════════════ */
const PEOPLE_MASTER = [
  { id: "father",    name: "父",   boatLabel: "父",   role: "舟をこげる",  type: "father",   driver: true,  color: "#bdefff", line: "#12304a", accent: "#65f2ff", skin: "#f2c8a6", hair: "#27313e", outfit: "#296dff", icon: "father"           },
  { id: "mother",    name: "母",   boatLabel: "母",   role: "舟をこげる",  type: "mother",   driver: true,  color: "#ffd6ef", line: "#4d1a3a", accent: "#ff72c6", skin: "#f4c5a9", hair: "#663247", outfit: "#c04789", icon: "mother"           },
  { id: "son1",      name: "息子1", boatLabel: "息子1", role: "子ども",    type: "son",      driver: false, color: "#cfe8ff", line: "#173f6c", accent: "#37d7ff", skin: "#efc1a0", hair: "#3a2619", outfit: "#2186ff", icon: "son-cap",    risk: "（母×）" },
  { id: "son2",      name: "息子2", boatLabel: "息子2", role: "子ども",    type: "son",      driver: false, color: "#d8ffeb", line: "#164238", accent: "#56f0a7", skin: "#e8b996", hair: "#2b2020", outfit: "#1aa783", icon: "son-headphones", risk: "（母×）" },
  { id: "daughter1", name: "娘1",  boatLabel: "娘1",  role: "子ども",    type: "daughter", driver: false, color: "#ffe5c7", line: "#71411d", accent: "#ffb23f", skin: "#f1bf9f", hair: "#6d3d22", outfit: "#ff8d45", icon: "daughter-bow",    risk: "（父×）" },
  { id: "daughter2", name: "娘2",  boatLabel: "娘2",  role: "子ども",    type: "daughter", driver: false, color: "#ffe0f4", line: "#6c2750", accent: "#ff77c8", skin: "#f0bea0", hair: "#563044", outfit: "#d954a8", icon: "daughter-pigtails", risk: "（父×）" },
  { id: "maid",      name: "召使", boatLabel: "召使", role: "舟をこげる",  type: "maid",     driver: true,  color: "#e9dcff", line: "#34204f", accent: "#d9cbff", skin: "#efc7ad", hair: "#2f2734", outfit: "#4f3a81", icon: "maid"             },
  { id: "dog",       name: "犬",   boatLabel: "犬",   role: "召使が必要", type: "dog",      driver: false, color: "#ffe2bd", line: "#6e452a", accent: "#ffbd5f", skin: "#c8834a", hair: "#7a4a2f", outfit: "#f4b66d", icon: "dog"              },
];

/* ═══════════════════════════════════════════════
   GLOBAL STATE
   ═══════════════════════════════════════════════ */
const STORAGE_KEY = "kawatari_progress_v1";

let currentLevel = null;   // LEVELS entry
let people = [];           // active person objects (clones with .side)
let gameState = {
  boatSide: "left",
  selected: [],
  disembarkTarget: null,
  moveCount: 0,
  isMoving: false,
  toastTimer: null,
  timerInterval: null,
  startTime: null,
  elapsedSeconds: 0,
};

/* ═══════════════════════════════════════════════
   PROGRESS (localStorage)
   ═══════════════════════════════════════════════ */
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function markCleared(levelId, moves, seconds) {
  const p = loadProgress();
  const prev = p[levelId];
  if (!prev || moves < prev.moves || (moves === prev.moves && seconds < prev.time)) {
    p[levelId] = { moves, time: seconds };
    saveProgress(p);
  }
}
function isCleared(levelId) { return !!loadProgress()[levelId]; }
function bestRecord(levelId) { return loadProgress()[levelId] || null; }

/* ═══════════════════════════════════════════════
   GLOBAL STATS (Cloudflare Pages Function)
   ═══════════════════════════════════════════════ */
const STATS_URL = "/api/stats";

async function reportAccess() {
  try { await fetch(STATS_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "access" }) }); }
  catch {}
}
async function reportClear(levelId, name, moves, time) {
  try { await fetch(STATS_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "clear", levelId, name, moves, time }) }); }
  catch {}
}
async function fetchGlobalStats() {
  try {
    const r = await fetch(STATS_URL);
    return await r.json();
  } catch { return null; }
}
async function fetchLevelScores(levelId) {
  try {
    const r = await fetch(STATS_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "scores", levelId }) });
    const d = await r.json();
    return d.scores || [];
  } catch { return []; }
}

/* ═══════════════════════════════════════════════
   DOM REFS
   ═══════════════════════════════════════════════ */
const screens = {
  select: document.getElementById("screen-select"),
  intro:  document.getElementById("screen-intro"),
  game:   document.getElementById("screen-game"),
};

const elSel = {
  grid:       document.getElementById("levelGrid"),
  statsAccess: document.getElementById("statsAccesses"),
  statsClears: document.getElementById("statsClears"),
};

const elIntro = {
  badge:       document.getElementById("introBadge"),
  title:       document.getElementById("introTitle"),
  subtitle:    document.getElementById("introSubtitle"),
  text:        document.getElementById("introText"),
  constraints: document.getElementById("introConstraints"),
  moveLimit:   document.getElementById("introMoveLimit"),
  startBtn:    document.getElementById("introStartBtn"),
  backBtn:     document.getElementById("introBackBtn"),
  scores:      document.getElementById("introScores"),
  scoresList:  document.getElementById("introScoresList"),
};

const el = {
  board:         document.querySelector(".board"),
  leftPeople:    document.getElementById("leftPeople"),
  rightPeople:   document.getElementById("rightPeople"),
  boatButton:    document.getElementById("boatButton"),
  boatPassengers:document.getElementById("boatPassengers"),
  crossButton:   document.getElementById("crossButton"),
  clearButton:   document.getElementById("clearButton"),
  resetButton:   document.getElementById("resetButton"),
  backToSelect:  document.getElementById("backToSelect"),
  moveCount:     document.getElementById("moveCount"),
  boatSideText:  document.getElementById("boatSideText"),
  selectionCount:document.getElementById("selectionCount"),
  leftCount:     document.getElementById("leftCount"),
  rightCount:    document.getElementById("rightCount"),
  moveLimitBadge:document.getElementById("moveLimitBadge"),
  timerDisplay:  document.getElementById("timerDisplay"),
  toast:         document.getElementById("toast"),
  ruleToggle:    document.getElementById("ruleToggle"),
  rules:         document.getElementById("rules"),
  winDialog:     document.getElementById("winDialog"),
  winTitle:      document.getElementById("winTitle"),
  finalMoves:    document.getElementById("finalMoves"),
  finalTime:     document.getElementById("finalTime"),
  nameInput:     document.getElementById("nameInput"),
  submitScore:   document.getElementById("submitScore"),
  nextLevelBtn:  document.getElementById("nextLevelBtn"),
  playAgainButton:document.getElementById("playAgainButton"),
  backFromWin:   document.getElementById("backFromWin"),
};

const sideLabel = { left: "左岸", right: "右岸" };

/* ═══════════════════════════════════════════════
   SCREEN NAVIGATION
   ═══════════════════════════════════════════════ */
function showScreen(name) {
  Object.entries(screens).forEach(([k, v]) => v.classList.toggle("active", k === name));
}

/* ═══════════════════════════════════════════════
   LEVEL SELECT SCREEN
   ═══════════════════════════════════════════════ */
async function initSelectScreen() {
  showScreen("select");
  buildLevelGrid();

  const stats = await fetchGlobalStats();
  if (stats) {
    if (elSel.statsAccess) elSel.statsAccess.textContent = stats.accesses.toLocaleString();
    if (elSel.statsClears) elSel.statsClears.textContent = stats.clears.toLocaleString();
  }
}

function buildLevelGrid() {
  const progress = loadProgress();
  elSel.grid.innerHTML = "";

  LEVELS.forEach((lvl, idx) => {
    const unlocked = idx === 0 || isCleared(LEVELS[idx - 1].id);
    const cleared  = isCleared(lvl.id);
    const best     = progress[lvl.id];

    const card = document.createElement("button");
    card.type = "button";
    card.className = "level-card" + (cleared ? " cleared" : "") + (unlocked ? "" : " locked");
    card.disabled = !unlocked;
    card.innerHTML = `
      <span class="level-num">${lvl.id}</span>
      <span class="level-card-title">${lvl.title}</span>
      ${cleared && best ? `<span class="level-best">${best.moves}手 ${formatTime(best.time)}</span>` : ""}
      ${!unlocked ? `<span class="level-lock">🔒</span>` : ""}
      ${cleared ? `<span class="level-check">✓</span>` : ""}
    `;
    card.addEventListener("click", () => openIntroScreen(lvl));
    elSel.grid.append(card);
  });
}

/* ═══════════════════════════════════════════════
   INTRO SCREEN
   ═══════════════════════════════════════════════ */
async function openIntroScreen(lvl) {
  currentLevel = lvl;

  elIntro.badge.textContent     = `ステージ ${lvl.id}`;
  elIntro.title.textContent     = lvl.title;
  elIntro.subtitle.textContent  = lvl.subtitle;
  elIntro.text.textContent      = lvl.intro;

  // Constraints summary
  const cap = lvl.boatCapacity ?? 2;
  const capLabel = cap === 3 ? "最大3人乗り" : cap === 1 ? "1人乗り" : "最大2人乗り";
  const cLines = [`• 船は${capLabel}`];
  if (lvl.constraints.fatherDaughter) cLines.push("• 父は母がいないと娘を怒ります");
  if (lvl.constraints.motherSon)      cLines.push("• 母は父がいないと息子を怒ります");
  if (lvl.constraints.dogMaid)        cLines.push("• 犬は召使がいないとみんなを噛み殺します");
  if (cLines.length === 1)            cLines.push("• 相性制約はありません");
  elIntro.constraints.innerHTML = cLines.join("<br>");

  elIntro.moveLimit.textContent = lvl.moveLimit
    ? `制限手数：${lvl.moveLimit}手以内`
    : "手数制限なし";

  // Leaderboard
  const scores = await fetchLevelScores(lvl.id);
  elIntro.scoresList.innerHTML = "";
  if (scores.length) {
    elIntro.scores.hidden = false;
    scores.forEach((s, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="rank">${i + 1}.</span><span class="sname">${s.name}</span><span class="smoves">${s.moves}手</span><span class="stime">${formatTime(s.time)}</span>`;
      elIntro.scoresList.append(li);
    });
  } else {
    elIntro.scores.hidden = true;
  }

  showScreen("intro");
}

elIntro.startBtn?.addEventListener("click", () => startGame(currentLevel));
elIntro.backBtn?.addEventListener("click", initSelectScreen);

/* ═══════════════════════════════════════════════
   GAME ENGINE
   ═══════════════════════════════════════════════ */
function startGame(lvl) {
  currentLevel = lvl;

  // Clone people for this level
  people = lvl.characters.map((id) => ({ ...PEOPLE_MASTER.find((p) => p.id === id), side: "left" }));

  // Set risk labels based on active constraints
  people.forEach((p) => {
    if (!lvl.constraints.fatherDaughter) delete p.risk;
    if (!lvl.constraints.motherSon && p.type === "son") delete p.risk;
    if (!lvl.constraints.fatherDaughter && p.type === "daughter") delete p.risk;
  });

  // Reset state
  Object.assign(gameState, {
    boatSide: "left",
    selected: [],
    disembarkTarget: null,
    moveCount: 0,
    isMoving: false,
    elapsedSeconds: 0,
    startTime: Date.now(),
  });

  // Move limit badge
  if (el.moveLimitBadge) {
    el.moveLimitBadge.textContent = lvl.moveLimit ? `残り ${lvl.moveLimit} 手` : "";
    el.moveLimitBadge.hidden = !lvl.moveLimit;
  }

  // Update active constraints in rules panel
  updateRulesPanel(lvl);

  // Start timer
  clearInterval(gameState.timerInterval);
  gameState.timerInterval = setInterval(tickTimer, 1000);

  showScreen("game");
  render();
}

function tickTimer() {
  gameState.elapsedSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
  if (el.timerDisplay) el.timerDisplay.textContent = formatTime(gameState.elapsedSeconds);
}

function updateRulesPanel(lvl) {
  const rulesEl = document.getElementById("rules");
  if (!rulesEl) return;
  const cap = lvl.boatCapacity ?? 2;
  const capLabel = cap === 1 ? "一人" : cap === 2 ? "一人か二人" : cap === 3 ? "一人から三人" : `${cap}人まで`;
  const items = [
    "対岸に全員を渡してください。",
    `船は${capLabel}で移動できます。`,
    "船は父、母、召使だけがこげます。",
  ];
  if (lvl.constraints.fatherDaughter) items.push("父は母親がいないと、娘を怒ります。");
  if (lvl.constraints.motherSon)      items.push("母は父親がいないと息子を怒ります。");
  if (lvl.constraints.dogMaid)        items.push("犬は召使がいないと、ほかのみんなを噛み殺します。");
  if (lvl.moveLimit) items.push(`${lvl.moveLimit}手以内にクリアしてください。`);
  rulesEl.innerHTML = "<ol>" + items.map((t) => `<li>${t}</li>`).join("") + "</ol>";
}

/* ═══════════════════════════════════════════════
   RENDER
   ═══════════════════════════════════════════════ */
function render() {
  if (gameState.disembarkTarget && !gameState.selected.includes(gameState.disembarkTarget)) {
    gameState.disembarkTarget = null;
  }

  el.leftPeople.innerHTML = "";
  el.rightPeople.innerHTML = "";

  people.forEach((person) => {
    if (gameState.selected.includes(person.id)) return;
    const button = createPersonButton(person);
    if (person.side !== gameState.boatSide || gameState.isMoving) button.disabled = true;
    (person.side === "left" ? el.leftPeople : el.rightPeople).append(button);
  });

  renderBoatPassengers();
  updateHud();
}

function createPersonButton(person) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "person";
  button.dataset.id = person.id;
  setAvatarVars(button, person);
  button.setAttribute("aria-label", `${person.name}${person.risk || ""}を選択`);

  const badge = person.driver
    ? `<span class="driver-badge" aria-label="舟をこげる">${boatIcon()}</span>`
    : "";

  button.innerHTML = `
    <span class="avatar">${personIcon(person)}</span>
    <span>
      <span class="person-name">${person.name}${person.risk ? `<span class="person-risk">${person.risk}</span>` : ""}</span>
      <span class="person-role">${person.role}</span>
    </span>
    ${badge}
  `;
  button.addEventListener("click", () => togglePerson(person.id));
  return button;
}

function setAvatarVars(el, person) {
  el.style.setProperty("--avatar-bg",     person.color);
  el.style.setProperty("--avatar-line",   person.line);
  el.style.setProperty("--avatar-accent", person.accent);
  el.style.setProperty("--avatar-skin",   person.skin);
  el.style.setProperty("--avatar-hair",   person.hair);
  el.style.setProperty("--avatar-outfit", person.outfit);
}

function renderBoatPassengers() {
  const onboardProblem = findBoatPassengerProblem(gameState.selected.map(getPerson));

  el.boatButton.dataset.side = gameState.boatSide;
  el.boatButton.classList.toggle("moving", gameState.isMoving);
  el.boatButton.classList.toggle("conflict", Boolean(onboardProblem));
  el.board.classList.toggle("has-boat-conflict", Boolean(onboardProblem));
  el.boatPassengers.innerHTML = "";

  gameState.selected.forEach((id) => {
    const person = getPerson(id);
    const mini = document.createElement("button");
    mini.type = "button";
    mini.className = "boat-mini";
    mini.dataset.id = person.id;
    mini.setAttribute("aria-label", `${person.boatLabel}を降ろす`);
    mini.classList.toggle("selected", gameState.disembarkTarget === person.id);
    mini.classList.toggle("danger", onboardProblem?.ids.includes(person.id));
    setAvatarVars(mini, person);
    mini.innerHTML = `<span class="boat-mini-label">${person.boatLabel}</span><span class="boat-mini-icon">${personIcon(person)}</span>`;
    mini.addEventListener("click", (e) => { e.stopPropagation(); toggleDisembarkTarget(person.id); });
    el.boatPassengers.append(mini);
  });
}

function updateHud() {
  const leftTotal  = people.filter((p) => p.side === "left").length;
  const rightTotal = people.filter((p) => p.side === "right").length;
  const lim = currentLevel?.moveLimit;

  el.moveCount.textContent    = gameState.moveCount;
  el.boatSideText.textContent = sideLabel[gameState.boatSide];
  el.selectionCount.textContent = `${gameState.selected.length} / ${currentLevel?.boatCapacity ?? 2}`;
  el.leftCount.textContent    = `${leftTotal}人`;
  el.rightCount.textContent   = `${rightTotal}人`;
  el.crossButton.disabled     = gameState.selected.length === 0 || gameState.isMoving;
  el.crossButton.classList.toggle("returning", gameState.boatSide === "right");
  el.clearButton.disabled     = !gameState.disembarkTarget || gameState.isMoving;

  if (el.moveLimitBadge && lim) {
    const remaining = lim - gameState.moveCount;
    el.moveLimitBadge.textContent = `残り ${remaining} 手`;
    el.moveLimitBadge.classList.toggle("warn", remaining <= 3);
  }
}

/* ═══════════════════════════════════════════════
   INTERACTION
   ═══════════════════════════════════════════════ */
function togglePerson(id) {
  if (gameState.isMoving) return;
  const person = getPerson(id);
  if (person.side !== gameState.boatSide) { showToast("舟がある岸の人だけを乗せられます。", "warn"); return; }
  if (gameState.selected.includes(id)) {
    gameState.selected = gameState.selected.filter((s) => s !== id);
    if (gameState.disembarkTarget === id) gameState.disembarkTarget = null;
    render(); return;
  }
  const cap = currentLevel?.boatCapacity ?? 2;
  if (gameState.selected.length >= cap) { showToast(`舟に乗れるのは${cap}人までです。`, "warn"); return; }
  gameState.selected.push(id);
  gameState.disembarkTarget = null;
  render();
}

function toggleDisembarkTarget(id) {
  if (gameState.isMoving) return;
  gameState.disembarkTarget = gameState.disembarkTarget === id ? null : id;
  render();
}

function disembarkSelectedPassenger() {
  if (gameState.isMoving || !gameState.disembarkTarget) return;
  gameState.selected = gameState.selected.filter((id) => id !== gameState.disembarkTarget);
  gameState.disembarkTarget = null;
  render();
}

function tryCross() {
  if (gameState.isMoving) return;
  const validation = validateMove();
  if (!validation.ok) { showInvalid(validation); return; }
  crossRiver();
}

/* ═══════════════════════════════════════════════
   VALIDATION
   ═══════════════════════════════════════════════ */
function validateMove() {
  if (gameState.selected.length === 0) return { ok: false, message: "舟に乗る人を選んでください。", conflictIds: [] };

  const passengers = gameState.selected.map(getPerson);
  const boatProblem = findBoatPassengerProblem(passengers);
  if (boatProblem) return { ok: false, message: boatProblem.message, conflictIds: boatProblem.ids };

  if (!passengers.some((p) => p.driver))
    return { ok: false, message: "この二人では舟をこげません。父・母・召使の誰かを乗せてください。", conflictIds: gameState.selected };

  // Move limit check
  if (currentLevel?.moveLimit && gameState.moveCount >= currentLevel.moveLimit)
    return { ok: false, message: `手数制限（${currentLevel.moveLimit}手）を超えました。リセットして最初からやり直してください。`, conflictIds: [] };

  const nextSide = opposite(gameState.boatSide);
  const snapshot = people.map((p) => ({ ...p, side: gameState.selected.includes(p.id) ? nextSide : p.side }));
  const safetyProblem = findSafetyProblem(snapshot);
  if (safetyProblem) return { ok: false, message: safetyProblem.message, conflictIds: safetyProblem.ids };

  return { ok: true };
}

function cons() { return currentLevel?.constraints ?? { fatherDaughter: true, motherSon: true, dogMaid: true }; }

function findBoatPassengerProblem(passengers) {
  if (passengers.length < 2) return null;
  const c = cons();
  const types = new Set(passengers.map((p) => p.type));
  const ids   = new Set(passengers.map((p) => p.id));
  if (c.fatherDaughter && types.has("father") && types.has("daughter") && !types.has("mother"))
    return { message: "父と娘だけでは渡れません。父が娘を怒ります！", ids: passengers.filter((p) => p.type === "father" || p.type === "daughter").map((p) => p.id) };
  if (c.motherSon && types.has("mother") && types.has("son") && !types.has("father"))
    return { message: "母と息子だけでは渡れません。母が息子を怒ります！", ids: passengers.filter((p) => p.type === "mother" || p.type === "son").map((p) => p.id) };
  if (c.dogMaid && ids.has("dog") && !ids.has("maid") && passengers.some((p) => p.type !== "dog"))
    return { message: "犬は召使なしでは家族と船に乗れません！", ids: passengers.map((p) => p.id) };
  return null;
}

function findSafetyProblem(snapshot) {
  const c = cons();
  for (const side of ["left", "right"]) {
    const group = snapshot.filter((p) => p.side === side);
    const types = new Set(group.map((p) => p.type));
    const ids   = new Set(group.map((p) => p.id));
    if (c.fatherDaughter && types.has("father") && types.has("daughter") && !types.has("mother"))
      return { message: `${sideLabel[side]}で父と娘が母なしになります！`, ids: group.filter((p) => p.type === "father" || p.type === "daughter").map((p) => p.id) };
    if (c.motherSon && types.has("mother") && types.has("son") && !types.has("father"))
      return { message: `${sideLabel[side]}で母と息子が父なしになります！`, ids: group.filter((p) => p.type === "mother" || p.type === "son").map((p) => p.id) };
    if (c.dogMaid && ids.has("dog") && !ids.has("maid") && group.some((p) => p.type !== "dog"))
      return { message: `${sideLabel[side]}で犬が召使なしになります！みんなが噛まれる！`, ids: group.map((p) => p.id) };
  }
  return null;
}

function showInvalid(v) { markConflict(v.conflictIds); markBoatConflict(); showToast(v.message, "warn"); }

function markConflict(ids) {
  ids.forEach((id) => {
    const btn = document.querySelector(`.person[data-id="${id}"]`) || document.querySelector(`.boat-mini[data-id="${id}"]`);
    if (!btn) return;
    btn.classList.remove("danger");
    requestAnimationFrame(() => btn.classList.add("danger"));
  });
}

function markBoatConflict() {
  if (!gameState.selected.length) return;
  el.boatButton.classList.remove("danger");
  requestAnimationFrame(() => el.boatButton.classList.add("danger"));
  setTimeout(() => el.boatButton.classList.remove("danger"), 520);
}

/* ═══════════════════════════════════════════════
   CROSSING
   ═══════════════════════════════════════════════ */
function crossRiver() {
  gameState.isMoving = true;
  render();

  const nextSide = opposite(gameState.boatSide);
  el.boatButton.dataset.side = nextSide;

  setTimeout(() => {
    gameState.selected.forEach((id) => { getPerson(id).side = nextSide; });
    gameState.boatSide = nextSide;
    gameState.selected = [];
    gameState.disembarkTarget = null;
    gameState.moveCount += 1;
    gameState.isMoving = false;
    render();

    if (people.every((p) => p.side === "right")) showWin();
  }, 650);
}

/* ═══════════════════════════════════════════════
   WIN FLOW
   ═══════════════════════════════════════════════ */
function showWin() {
  clearInterval(gameState.timerInterval);
  const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
  gameState.elapsedSeconds = elapsed;

  // Record local best
  markCleared(currentLevel.id, gameState.moveCount, elapsed);

  if (el.winTitle)   el.winTitle.textContent   = `ステージ ${currentLevel.id}「${currentLevel.title}」クリア！`;
  if (el.finalMoves) el.finalMoves.textContent = gameState.moveCount;
  if (el.finalTime)  el.finalTime.textContent  = formatTime(elapsed);

  // Show/hide next level button
  const nextLvl = LEVELS.find((l) => l.id === currentLevel.id + 1);
  if (el.nextLevelBtn) el.nextLevelBtn.hidden = !nextLvl;

  showToast("全員が右岸に到着しました！", "good");
  if (el.winDialog?.showModal) el.winDialog.showModal();
}

// Score submission
el.submitScore?.addEventListener("click", async () => {
  const name = (el.nameInput?.value || "").trim() || "匿名";
  await reportClear(currentLevel.id, name, gameState.moveCount, gameState.elapsedSeconds);
  el.submitScore.disabled = true;
  el.submitScore.textContent = "送信済み ✓";
  showToast("スコアを記録しました！", "good");
});

el.nextLevelBtn?.addEventListener("click", () => {
  el.winDialog?.close();
  const nextLvl = LEVELS.find((l) => l.id === currentLevel.id + 1);
  if (nextLvl) openIntroScreen(nextLvl);
});

el.playAgainButton?.addEventListener("click", () => {
  el.winDialog?.close();
  resetGame();
});

el.backFromWin?.addEventListener("click", () => {
  el.winDialog?.close();
  initSelectScreen();
});

/* ═══════════════════════════════════════════════
   RESET / BACK
   ═══════════════════════════════════════════════ */
function resetGame() {
  clearInterval(gameState.timerInterval);
  people.forEach((p) => { p.side = "left"; });
  Object.assign(gameState, {
    boatSide: "left", selected: [], disembarkTarget: null,
    moveCount: 0, isMoving: false, elapsedSeconds: 0, startTime: Date.now(),
  });
  if (el.submitScore) { el.submitScore.disabled = false; el.submitScore.textContent = "記録する"; }
  if (el.nameInput) el.nameInput.value = "";
  if (el.moveLimitBadge && currentLevel?.moveLimit) {
    el.moveLimitBadge.textContent = `残り ${currentLevel.moveLimit} 手`;
    el.moveLimitBadge.classList.remove("warn");
    el.moveLimitBadge.hidden = false;
  }
  gameState.timerInterval = setInterval(tickTimer, 1000);
  render();
}

el.resetButton?.addEventListener("click", resetGame);
el.backToSelect?.addEventListener("click", () => {
  clearInterval(gameState.timerInterval);
  initSelectScreen();
});

/* ═══════════════════════════════════════════════
   GAME CONTROLS
   ═══════════════════════════════════════════════ */
el.crossButton?.addEventListener("click", tryCross);
el.boatButton?.addEventListener("click", tryCross);
el.boatButton?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tryCross(); }
});
el.clearButton?.addEventListener("click", disembarkSelectedPassenger);
el.ruleToggle?.addEventListener("click", () => {
  const open = el.rules.classList.toggle("open");
  el.ruleToggle.setAttribute("aria-expanded", String(open));
});

/* ═══════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════ */
function showToast(msg, tone) {
  clearTimeout(gameState.toastTimer);
  el.toast.textContent = msg;
  el.toast.classList.toggle("good", tone === "good");
  el.toast.classList.add("show");
  gameState.toastTimer = setTimeout(() => el.toast.classList.remove("show"), 2800);
}

/* ═══════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════ */
function getPerson(id) { return people.find((p) => p.id === id); }
function opposite(side) { return side === "left" ? "right" : "left"; }
function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}分${s.toString().padStart(2, "0")}秒` : `${s}秒`;
}

/* ═══════════════════════════════════════════════
   SVG ICONS  (chibi characters)
   ═══════════════════════════════════════════════ */
function personIcon(person) {
  const icons = {
    father: `
      <path class="outfit" d="M11 64c2-13 9-20 21-20s19 7 21 20z"/>
      <path class="accent" d="M28 47 32 44l4 3-1.5 8h-5z"/>
      <rect class="skin" x="27" y="39" width="10" height="6" rx="3"/>
      <circle class="skin" cx="32" cy="26" r="16"/>
      <path class="hair" d="M16 22c1-9.5 7.5-14.5 16-14.5s15 5 16 14.5c-2.5-5.5-8-9-16-9s-13.5 3.5-16 9z"/>
      <circle class="dark" cx="26.5" cy="27" r="4"/>
      <circle class="dark" cx="37.5" cy="27" r="4"/>
      <circle class="white" cx="28.1" cy="25.2" r="1.7"/>
      <circle class="white" cx="39.1" cy="25.2" r="1.7"/>
      <ellipse cx="20" cy="33" rx="5.5" ry="3.2" fill="#ffb8c8" opacity="0.6"/>
      <ellipse cx="44" cy="33" rx="5.5" ry="3.2" fill="#ffb8c8" opacity="0.6"/>
      <path class="stroke" stroke-width="2.3" d="M26 35.5c3 3 13 3 12 0"/>`,
    mother: `
      <path class="outfit" d="M11.5 64c2.5-13 9-20 20.5-20s18 7 20.5 20z"/>
      <path class="accent" d="M20 52c3-5 6.5-8 12-8s9 3 12 8z" opacity="0.8"/>
      <rect class="skin" x="27" y="39" width="10" height="6" rx="3"/>
      <circle class="skin" cx="32" cy="26" r="15.5"/>
      <path class="hair" d="M17 28c-1.5-10 5-17 15-17s16.5 7 15 17c-4-7.5-11-11.5-15-11.5s-11 4-15 11.5z"/>
      <path class="hair" d="M17 28c0 7 2.5 10.5 4 5-1.5-5.5-.5-11 0-12zM47 28c0 7-2.5 10.5-4 5 1.5-5.5.5-11 0-12z"/>
      <circle class="accent" cx="16" cy="33.5" r="3.2"/>
      <circle class="accent" cx="48" cy="33.5" r="3.2"/>
      <circle class="dark" cx="26.5" cy="27" r="3.8"/>
      <circle class="dark" cx="37.5" cy="27" r="3.8"/>
      <circle class="white" cx="28" cy="25.2" r="1.6"/>
      <circle class="white" cx="39" cy="25.2" r="1.6"/>
      <ellipse cx="20" cy="32.5" rx="5.5" ry="3" fill="#ffb8c8" opacity="0.62"/>
      <ellipse cx="44" cy="32.5" rx="5.5" ry="3" fill="#ffb8c8" opacity="0.62"/>
      <path class="stroke" stroke-width="2.2" d="M26.5 35c3 2.5 11 2.5 11 0"/>`,
    "son-cap": `
      <path class="outfit" d="M11.5 64c2-13 8.5-20 20.5-20s18.5 7 20.5 20z"/>
      <rect class="skin" x="27" y="39" width="10" height="6" rx="3"/>
      <circle class="skin" cx="32" cy="26.5" r="15.5"/>
      <path class="hair" d="M17 23c.5-8.5 6.5-14 15-14s14.5 5.5 15 14c-2.5-5-7.5-8.5-15-8.5S19.5 18 17 23z"/>
      <path class="accent" d="M20.5 21c3-5.5 8.5-8 11.5-8s8.5 2.5 11.5 8c-7.5-3-16-3-23 0z"/>
      <path class="accent" d="M41.5 21.8 48.5 21.8c-1.5 2.5-4 3.8-7.5 3.8z"/>
      <circle class="dark" cx="26.5" cy="27.5" r="4"/>
      <circle class="dark" cx="37.5" cy="27.5" r="4"/>
      <circle class="white" cx="28" cy="25.7" r="1.6"/>
      <circle class="white" cx="39" cy="25.7" r="1.6"/>
      <ellipse cx="20" cy="33.5" rx="5.5" ry="3" fill="#ffb8c8" opacity="0.55"/>
      <ellipse cx="44" cy="33.5" rx="5.5" ry="3" fill="#ffb8c8" opacity="0.55"/>
      <path class="stroke" stroke-width="2.3" d="M26.5 36c3 2.5 11 2.5 11 0"/>`,
    "son-headphones": `
      <path class="outfit" d="M11.5 64c2-13 8.5-20 20.5-20s18.5 7 20.5 20z"/>
      <rect class="accent" x="17" y="28.5" width="6.5" height="10.5" rx="2.8"/>
      <rect class="accent" x="40.5" y="28.5" width="6.5" height="10.5" rx="2.8"/>
      <path class="stroke" stroke-width="2.8" d="M21 29v-4c0-6.5 4.5-11 11-11s11 4.5 11 11v4"/>
      <rect class="skin" x="27" y="39" width="10" height="6" rx="3"/>
      <circle class="skin" cx="32" cy="26.5" r="15.5"/>
      <path class="hair" d="M17 23c.5-8 6-13.5 15-13.5S46 18 46 23c-2.5-5-7-8-15-8S19.5 18 17 23z"/>
      <circle class="dark" cx="26.5" cy="27.5" r="3.8"/>
      <circle class="dark" cx="37.5" cy="27.5" r="3.8"/>
      <circle class="white" cx="28" cy="25.8" r="1.5"/>
      <circle class="white" cx="39" cy="25.8" r="1.5"/>
      <ellipse cx="20" cy="33.5" rx="5" ry="3" fill="#ffb8c8" opacity="0.55"/>
      <ellipse cx="44" cy="33.5" rx="5" ry="3" fill="#ffb8c8" opacity="0.55"/>
      <path class="stroke" stroke-width="2.3" d="M26.5 36c3 2.5 11 2.5 11 0"/>`,
    "daughter-bow": `
      <path class="outfit" d="M12 64c2-13 8.5-20 20-20s18 7 20 20z"/>
      <path class="hair" d="M18.5 28.5c-1.5-10 4-16.5 13.5-16.5s15 6.5 13.5 16.5c-4-7-9.5-11-13.5-11s-9.5 4-13.5 11z"/>
      <path class="hair" d="M18.5 28.5c0 7.5 2.5 10.5 4 5.5-1.5-5-.5-11 0-12.5zM45.5 28.5c0 7.5-2.5 10.5-4 5.5 1.5-5 .5-11 0-12.5z"/>
      <rect class="skin" x="27" y="39" width="10" height="6" rx="3"/>
      <circle class="skin" cx="32" cy="27" r="15.5"/>
      <path class="accent" d="M27.5 11.5 32 17l4.5-5.5v9L32 16.5l-4.5 6z"/>
      <circle class="dark" cx="26.5" cy="27.5" r="4"/>
      <circle class="dark" cx="37.5" cy="27.5" r="4"/>
      <circle class="white" cx="28.1" cy="25.7" r="1.7"/>
      <circle class="white" cx="39.1" cy="25.7" r="1.7"/>
      <ellipse cx="20" cy="33" rx="5.5" ry="3.2" fill="#ffb8c8" opacity="0.62"/>
      <ellipse cx="44" cy="33" rx="5.5" ry="3.2" fill="#ffb8c8" opacity="0.62"/>
      <path class="stroke" stroke-width="2.3" d="M26.5 36c3 2.5 11.5 2.5 11 0"/>`,
    "daughter-pigtails": `
      <path class="outfit" d="M12 64c2-13 8.5-20 20-20s18 7 20 20z"/>
      <path class="hair" d="M19.5 28c-1-9.5 5-15 12.5-15s13.5 5.5 12.5 15c-5-6.5-15-6.5-25 0z"/>
      <circle class="hair" cx="17" cy="33" r="6"/>
      <circle class="hair" cx="47" cy="33" r="6"/>
      <path class="accent" d="M14.5 37.5l-5 4 .5-7zM49.5 37.5l5 4-.5-7z"/>
      <rect class="skin" x="27" y="39" width="10" height="6" rx="3"/>
      <circle class="skin" cx="32" cy="27" r="15.5"/>
      <circle class="dark" cx="26.5" cy="27.5" r="4"/>
      <circle class="dark" cx="37.5" cy="27.5" r="4"/>
      <circle class="white" cx="28.1" cy="25.7" r="1.7"/>
      <circle class="white" cx="39.1" cy="25.7" r="1.7"/>
      <ellipse cx="20" cy="33" rx="5.5" ry="3.2" fill="#ffb8c8" opacity="0.62"/>
      <ellipse cx="44" cy="33" rx="5.5" ry="3.2" fill="#ffb8c8" opacity="0.62"/>
      <path class="stroke" stroke-width="2.3" d="M26.5 36c3 2.5 11.5 2.5 11 0"/>`,
    maid: `
      <path class="outfit" d="M11 64c2.5-13.5 9-21 21-21s18.5 7.5 21 21z"/>
      <path class="white" d="M24 47.5 32 43l8 4.5-3 12h-10z"/>
      <path class="accent" d="M21.5 52.5h21l2 11.5h-25z" opacity="0.72"/>
      <rect class="skin" x="27" y="39" width="10" height="6" rx="3"/>
      <circle class="skin" cx="32" cy="26" r="15.5"/>
      <path class="hair" d="M17.5 28c-1-9.5 5-15 14.5-15s15.5 5.5 14.5 15c-4-7.5-10.5-11-14.5-11s-10.5 3.5-14.5 11z"/>
      <path class="white" d="M18 19c2-5.5 7-9 14-9s12 3.5 14 9c-9-3.5-20-3.5-28 0z"/>
      <circle class="dark" cx="26.5" cy="27" r="3.8"/>
      <circle class="dark" cx="37.5" cy="27" r="3.8"/>
      <circle class="white" cx="28" cy="25.2" r="1.6"/>
      <circle class="white" cx="39" cy="25.2" r="1.6"/>
      <ellipse cx="20" cy="32.5" rx="5.5" ry="3" fill="#ffb8c8" opacity="0.55"/>
      <ellipse cx="44" cy="32.5" rx="5.5" ry="3" fill="#ffb8c8" opacity="0.55"/>
      <path class="stroke" stroke-width="2.2" d="M26.5 35c3 2.5 11 2.5 11 0"/>`,
    dog: `
      <path class="hair" d="M15 27 10.5 13.5l13 5zM49 27 53.5 13.5l-13 5z"/>
      <path class="outfit" d="M18 30c0-9.5 5.5-15.5 14-15.5S46 20.5 46 30v7.5c0 7.5-5.5 12.5-14 12.5S18 45 18 37.5z"/>
      <path class="skin" d="M23 42c1.5 8.5 12.5 9 18 0-2.5 4.5-6 6.5-9 6.5s-6.5-2-9-6.5z"/>
      <circle class="dark" cx="27" cy="32" r="3"/>
      <circle class="dark" cx="37" cy="32" r="3"/>
      <circle class="white" cx="28.2" cy="30.5" r="1.2"/>
      <circle class="white" cx="38.2" cy="30.5" r="1.2"/>
      <ellipse cx="22" cy="37" rx="4.5" ry="2.8" fill="#ffb8c8" opacity="0.55"/>
      <ellipse cx="42" cy="37" rx="4.5" ry="2.8" fill="#ffb8c8" opacity="0.55"/>
      <path class="dark" d="M28.5 38.5c2-2 5-2 7 0-1.2 3-5.8 3-7 0z"/>
      <path d="M29.5 41c.6 4 4.4 4 5 0" fill="#ff9999" opacity="0.9"/>
      <path class="accent" d="M26 19c3-4.5 10-4.5 12 0-4-2-8-2-12 0z"/>
      <path d="M22 44.5c2.5-2.5 6.5-4 10-4s7.5 1.5 10 4" stroke="#ee3333" stroke-width="3.8" fill="none" stroke-linecap="round"/>
      <path d="M24 23.5c2-2.5 4-2.5 5-1M40 23.5c-2-2.5-4-2.5-5-1" stroke="var(--avatar-hair)" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
  };
  return `<svg aria-hidden="true" viewBox="0 0 64 64">${icons[person.icon] ?? ""}</svg>`;
}

function boatIcon() {
  return `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 13h16l-2.4 5H6.4z"/><path d="M8 13V7l5 3-5 3"/><path d="M4 20c1.6.8 3.2.8 4.8 0 1.6.8 3.2.8 4.8 0 1.6.8 3.2.8 4.8 0"/></svg>`;
}

/* ═══════════════════════════════════════════════
   BOOT — verify levels & show select screen
   ═══════════════════════════════════════════════ */
(function boot() {
  // Verify all levels are solvable (dev check — logs to console)
  LEVELS.forEach((lvl) => {
    const min = bfsSolve(lvl, PEOPLE_MASTER);
    if (min === null) {
      console.error(`Level ${lvl.id} "${lvl.title}" is UNSOLVABLE!`);
    } else {
      if (lvl.moveLimit && min > lvl.moveLimit) {
        console.error(`Level ${lvl.id} "${lvl.title}" moveLimit ${lvl.moveLimit} < minimum ${min}!`);
      } else {
        console.log(`Level ${lvl.id}: min=${min} moves${lvl.moveLimit ? ` (limit: ${lvl.moveLimit})` : ""} ✓`);
      }
    }
  });

  reportAccess();
  initSelectScreen();
})();
