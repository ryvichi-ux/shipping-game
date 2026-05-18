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
  { id: "son1",      name: "息子(A)", boatLabel: "息子A",  role: "子ども",   type: "son",      driver: false, color: "#cfe8ff", line: "#173f6c", accent: "#37d7ff", skin: "#efc1a0", hair: "#3a2619", outfit: "#2186ff", icon: "son-cap"           },
  { id: "son2",      name: "息子(B)", boatLabel: "息子B",  role: "子ども",   type: "son",      driver: false, color: "#d8ffeb", line: "#164238", accent: "#56f0a7", skin: "#e8b996", hair: "#2b2020", outfit: "#1aa783", icon: "son-headphones"    },
  { id: "daughter1", name: "娘(A)",  boatLabel: "娘A",    role: "子ども",   type: "daughter", driver: false, color: "#ffe5c7", line: "#71411d", accent: "#ffb23f", skin: "#f1bf9f", hair: "#6d3d22", outfit: "#ff8d45", icon: "daughter-bow"      },
  { id: "daughter2", name: "娘(B)",  boatLabel: "娘B",    role: "子ども",   type: "daughter", driver: false, color: "#ffe0f4", line: "#6c2750", accent: "#ff77c8", skin: "#f0bea0", hair: "#563044", outfit: "#d954a8", icon: "daughter-pigtails" },
  { id: "maid",      name: "召使い",  boatLabel: "召使い",  role: "舟をこげる", type: "maid",    driver: true,  color: "#e9dcff", line: "#34204f", accent: "#d9cbff", skin: "#efc7ad", hair: "#2f2734", outfit: "#4f3a81", icon: "maid"              },
  { id: "dog",       name: "犬",     boatLabel: "犬",     role: "召使必要",  type: "dog",      driver: false, color: "#ffe2bd", line: "#6e452a", accent: "#ffbd5f", skin: "#c8834a", hair: "#7a4a2f", outfit: "#f4b66d", icon: "dog"               },
];

/* ═══════════════════════════════════════════════
   GLOBAL STATE
   ═══════════════════════════════════════════════ */
const STORAGE_KEY = "kawatari_progress_v1";
let globalLevelClears = {};
let moveHistory = [];      // undo snapshots: [{peopleSides, boatSide, moveCount}]
let lastTapInfo = { id: null, time: 0 };  // cross-render double-tap tracking

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
  const flagKey = "kawatari_access_reported";
  if (localStorage.getItem(flagKey)) return;
  try {
    await fetch(STATS_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "access" }) });
    localStorage.setItem(flagKey, "1");
  } catch {}
}
async function reportCountClear(levelId, moves, time) {
  try { await fetch(STATS_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "count_clear", levelId, moves, time }) }); }
  catch {}
}
async function reportSubmitScore(levelId, name, moves, time) {
  try { await fetch(STATS_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "submit_score", levelId, name, moves, time }) }); }
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
  undoButton:    document.getElementById("undoButton"),
  gameLevelNum:  document.getElementById("gameLevelNum"),
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
    if (stats.levelClears) {
      globalLevelClears = stats.levelClears;
      buildLevelGrid();
    }
  }
}

function buildLevelGrid() {
  const progress = loadProgress();
  elSel.grid.innerHTML = "";

  LEVELS.forEach((lvl, idx) => {
    const unlocked = idx === 0 || isCleared(LEVELS[idx - 1].id);
    const cleared  = isCleared(lvl.id);
    const best     = progress[lvl.id];

    const clearCount = globalLevelClears[lvl.id] || 0;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "level-card" + (cleared ? " cleared" : "") + (unlocked ? "" : " locked");
    card.disabled = !unlocked;
    card.innerHTML = `
      <span class="level-num">${lvl.id}</span>
      <span class="level-card-title">${lvl.title}</span>
      ${cleared && best ? `<span class="level-best">${best.moves}手 ${formatTime(best.time)}</span>` : ""}
      ${unlocked && clearCount > 0 ? `<span class="level-clears">（${clearCount}人クリア）</span>` : ""}
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

  // Clone people for this level with dynamic role labels
  people = lvl.characters.map((id) => {
    const master = PEOPLE_MASTER.find((p) => p.id === id);
    const p = { ...master, side: "left" };
    if (p.type === "son") {
      p.role = lvl.constraints.motherSon ? "母NG" : "";
      p.roleRed = !!lvl.constraints.motherSon;
    } else if (p.type === "daughter") {
      p.role = lvl.constraints.fatherDaughter ? "父NG" : "";
      p.roleRed = !!lvl.constraints.fatherDaughter;
    } else if (p.id === "dog") {
      p.role = lvl.constraints.dogMaid ? "召使必要" : "";
      p.roleRed = !!lvl.constraints.dogMaid;
    }
    return p;
  });

  // Reset state
  moveHistory = [];
  Object.assign(gameState, {
    boatSide: "left",
    selected: [],
    disembarkTarget: null,
    moveCount: 0,
    isMoving: false,
    elapsedSeconds: 0,
    startTime: Date.now(),
  });

  // Level number in title
  if (el.gameLevelNum) el.gameLevelNum.textContent = `（${lvl.id}）`;

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
    const isSelected = gameState.selected.includes(person.id);
    const showLeft  = !isSelected && person.side === "left";
    const showRight = !isSelected && person.side === "right";

    // Left bank — always render a slot (real or ghost)
    if (showLeft) {
      const btn = createPersonButton(person);
      btn.disabled = gameState.boatSide !== "left" || gameState.isMoving;
      el.leftPeople.append(btn);
    } else {
      el.leftPeople.append(createPersonGhost());
    }

    // Right bank — always render a slot (real or ghost)
    if (showRight) {
      const btn = createPersonButton(person);
      btn.disabled = gameState.boatSide !== "right" || gameState.isMoving;
      el.rightPeople.append(btn);
    } else {
      el.rightPeople.append(createPersonGhost());
    }
  });

  renderBoatPassengers();
  updateHud();
}

function createPersonGhost() {
  const div = document.createElement("div");
  div.className = "person-ghost";
  return div;
}

function createPersonButton(person) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "person";
  button.dataset.id = person.id;
  setAvatarVars(button, person);
  button.setAttribute("aria-label", `${person.name}を選択`);

  const badge = person.driver
    ? `<span class="driver-badge" aria-label="舟をこげる">${boatIcon()}</span>`
    : "";

  button.innerHTML = `
    <span class="avatar">${personIcon(person)}</span>
    <span>
      <span class="person-name">${person.name}</span>
      ${person.role ? `<span class="person-role${person.roleRed ? " person-role-warn" : ""}">${person.role}</span>` : ""}
    </span>
    ${badge}
  `;
  setupPersonDrag(button, person);
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
    setupBoatMiniDrag(mini, person);
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
  if (el.undoButton) el.undoButton.disabled = moveHistory.length === 0 || gameState.isMoving;

  if (el.moveLimitBadge && lim) {
    const remaining = lim - gameState.moveCount;
    el.moveLimitBadge.textContent = `残り ${remaining} 手`;
    el.moveLimitBadge.classList.toggle("warn", remaining <= 3);
  }
}

/* ═══════════════════════════════════════════════
   DRAG & DROP
   ═══════════════════════════════════════════════ */
const DRAG_THRESHOLD = 6;

function setupPersonDrag(button, person) {
  let dragStartX, dragStartY, dragClone = null, isDragging = false, captureId = null;

  button.addEventListener("pointerdown", (e) => {
    if (button.disabled || gameState.isMoving) return;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    isDragging = false;
    captureId = e.pointerId;
    button.setPointerCapture(e.pointerId);
  });

  button.addEventListener("pointermove", (e) => {
    if (e.pointerId !== captureId) return;
    e.preventDefault();
    const dx = e.clientX - dragStartX, dy = e.clientY - dragStartY;
    if (!isDragging && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      isDragging = true;
      const rect = button.getBoundingClientRect();
      dragClone = button.cloneNode(true);
      Object.assign(dragClone.style, {
        position: "fixed", zIndex: "9999", pointerEvents: "none",
        width: rect.width + "px", opacity: "0.88",
        transform: "scale(1.06) rotate(-1.5deg)",
        left: (e.clientX - rect.width / 2) + "px",
        top:  (e.clientY - rect.height / 2) + "px",
      });
      document.body.appendChild(dragClone);
      button.style.opacity = "0.28";
      el.boatButton.classList.add("drop-target");
    }
    if (isDragging && dragClone) {
      const rect = button.getBoundingClientRect();
      dragClone.style.left = (e.clientX - rect.width / 2) + "px";
      dragClone.style.top  = (e.clientY - rect.height / 2) + "px";
    }
  });

  function endDrag(e) {
    if (dragClone) { dragClone.remove(); dragClone = null; }
    button.style.opacity = "";
    el.boatButton.classList.remove("drop-target");
    if (isDragging) {
      const br = el.boatButton.getBoundingClientRect();
      if (e.clientX >= br.left && e.clientX <= br.right && e.clientY >= br.top && e.clientY <= br.bottom) {
        togglePerson(person.id);
      }
    } else {
      togglePerson(person.id);
    }
    isDragging = false; captureId = null;
  }

  button.addEventListener("pointerup", endDrag);
  button.addEventListener("pointercancel", () => {
    if (dragClone) { dragClone.remove(); dragClone = null; }
    button.style.opacity = "";
    el.boatButton.classList.remove("drop-target");
    isDragging = false; captureId = null;
  });
}

function setupBoatMiniDrag(mini, person) {
  let dragStartX, dragStartY, dragClone = null, isDragging = false, captureId = null;

  mini.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    if (gameState.isMoving) return;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    isDragging = false;
    captureId = e.pointerId;
    mini.setPointerCapture(e.pointerId);
  });

  mini.addEventListener("pointermove", (e) => {
    if (e.pointerId !== captureId) return;
    e.preventDefault();
    const dx = e.clientX - dragStartX, dy = e.clientY - dragStartY;
    if (!isDragging && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      isDragging = true;
      const rect = mini.getBoundingClientRect();
      dragClone = mini.cloneNode(true);
      Object.assign(dragClone.style, {
        position: "fixed", zIndex: "9999", pointerEvents: "none",
        width: rect.width + "px", height: rect.height + "px",
        opacity: "0.88", transform: "scale(1.1)",
        left: (e.clientX - rect.width / 2) + "px",
        top:  (e.clientY - rect.height / 2) + "px",
      });
      document.body.appendChild(dragClone);
      mini.style.opacity = "0.28";
    }
    if (isDragging && dragClone) {
      const rect = mini.getBoundingClientRect();
      dragClone.style.left = (e.clientX - rect.width / 2) + "px";
      dragClone.style.top  = (e.clientY - rect.height / 2) + "px";
    }
  });

  function disembarkPerson() {
    gameState.selected = gameState.selected.filter((id) => id !== person.id);
    if (gameState.disembarkTarget === person.id) gameState.disembarkTarget = null;
    render();
  }

  function endMiniDrag(e) {
    if (dragClone) { dragClone.remove(); dragClone = null; }
    mini.style.opacity = "";
    if (isDragging) {
      const br = el.boatButton.getBoundingClientRect();
      if (e.clientX < br.left || e.clientX > br.right || e.clientY < br.top || e.clientY > br.bottom) {
        disembarkPerson();
      }
    } else {
      const now = Date.now();
      if (lastTapInfo.id === person.id && now - lastTapInfo.time < 320) {
        lastTapInfo = { id: null, time: 0 };
        disembarkPerson();
      } else {
        lastTapInfo = { id: person.id, time: now };
        toggleDisembarkTarget(person.id);
      }
    }
    isDragging = false; captureId = null;
  }

  mini.addEventListener("pointerup", (e) => { e.stopPropagation(); endMiniDrag(e); });
  mini.addEventListener("pointercancel", () => {
    if (dragClone) { dragClone.remove(); dragClone = null; }
    mini.style.opacity = "";
    isDragging = false; captureId = null;
  });
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
function saveSnapshot() {
  moveHistory.push({
    peopleSides: people.map((p) => p.side),
    boatSide: gameState.boatSide,
    moveCount: gameState.moveCount,
  });
}

function undoMove() {
  if (!moveHistory.length) { showToast("これ以上戻れません。", "warn"); return; }
  const snap = moveHistory.pop();
  snap.peopleSides.forEach((side, i) => { people[i].side = side; });
  gameState.boatSide = snap.boatSide;
  gameState.moveCount = snap.moveCount;
  gameState.selected = [];
  gameState.disembarkTarget = null;
  if (el.moveLimitBadge && currentLevel?.moveLimit) {
    const rem = currentLevel.moveLimit - snap.moveCount;
    el.moveLimitBadge.textContent = `残り ${rem} 手`;
    el.moveLimitBadge.classList.toggle("warn", rem <= 3);
  }
  render();
}

function crossRiver() {
  saveSnapshot();
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

  // Auto-report to global counter (no name needed)
  reportCountClear(currentLevel.id, gameState.moveCount, elapsed);

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
  await reportSubmitScore(currentLevel.id, name, gameState.moveCount, gameState.elapsedSeconds);
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
  moveHistory = [];
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
el.undoButton?.addEventListener("click", undoMove);
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
   CHARACTER ICONS  (PNG sprite)
   ═══════════════════════════════════════════════ */
function personIcon(person) {
  return `<span class="char-sprite" data-char="${person.icon}"></span>`;
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
