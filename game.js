const people = [
  {
    id: "father",
    name: "父",
    boatLabel: "父",
    role: "舟をこげる",
    type: "father",
    driver: true,
    side: "left",
    color: "#bdefff",
    line: "#12304a",
    accent: "#65f2ff",
    skin: "#f2c8a6",
    hair: "#27313e",
    outfit: "#296dff",
    icon: "father",
  },
  {
    id: "mother",
    name: "母",
    boatLabel: "母",
    role: "舟をこげる",
    type: "mother",
    driver: true,
    side: "left",
    color: "#ffd6ef",
    line: "#4d1a3a",
    accent: "#ff72c6",
    skin: "#f4c5a9",
    hair: "#663247",
    outfit: "#c04789",
    icon: "mother",
  },
  {
    id: "son1",
    name: "息子1",
    risk: "（母×）",
    boatLabel: "息子1",
    role: "子ども",
    type: "son",
    driver: false,
    side: "left",
    color: "#cfe8ff",
    line: "#173f6c",
    accent: "#37d7ff",
    skin: "#efc1a0",
    hair: "#3a2619",
    outfit: "#2186ff",
    icon: "son-cap",
  },
  {
    id: "son2",
    name: "息子2",
    risk: "（母×）",
    boatLabel: "息子2",
    role: "子ども",
    type: "son",
    driver: false,
    side: "left",
    color: "#d8ffeb",
    line: "#164238",
    accent: "#56f0a7",
    skin: "#e8b996",
    hair: "#2b2020",
    outfit: "#1aa783",
    icon: "son-headphones",
  },
  {
    id: "daughter1",
    name: "娘1",
    risk: "（父×）",
    boatLabel: "娘1",
    role: "子ども",
    type: "daughter",
    driver: false,
    side: "left",
    color: "#ffe5c7",
    line: "#71411d",
    accent: "#ffb23f",
    skin: "#f1bf9f",
    hair: "#6d3d22",
    outfit: "#ff8d45",
    icon: "daughter-bow",
  },
  {
    id: "daughter2",
    name: "娘2",
    risk: "（父×）",
    boatLabel: "娘2",
    role: "子ども",
    type: "daughter",
    driver: false,
    side: "left",
    color: "#ffe0f4",
    line: "#6c2750",
    accent: "#ff77c8",
    skin: "#f0bea0",
    hair: "#563044",
    outfit: "#d954a8",
    icon: "daughter-pigtails",
  },
  {
    id: "maid",
    name: "召使い",
    boatLabel: "召使",
    role: "舟をこげる",
    type: "maid",
    driver: true,
    side: "left",
    color: "#e9dcff",
    line: "#34204f",
    accent: "#d9cbff",
    skin: "#efc7ad",
    hair: "#2f2734",
    outfit: "#4f3a81",
    icon: "maid",
  },
  {
    id: "dog",
    name: "犬",
    boatLabel: "犬",
    role: "召使いが必要",
    type: "dog",
    driver: false,
    side: "left",
    color: "#ffe2bd",
    line: "#6e452a",
    accent: "#ffbd5f",
    skin: "#c8834a",
    hair: "#7a4a2f",
    outfit: "#f4b66d",
    icon: "dog",
  },
];

const state = {
  boatSide: "left",
  selected: [],
  disembarkTarget: null,
  moveCount: 0,
  isMoving: false,
  toastTimer: null,
};

const el = {
  board: document.querySelector(".board"),
  leftPeople: document.querySelector("#leftPeople"),
  rightPeople: document.querySelector("#rightPeople"),
  boatButton: document.querySelector("#boatButton"),
  boatPassengers: document.querySelector("#boatPassengers"),
  crossButton: document.querySelector("#crossButton"),
  clearButton: document.querySelector("#clearButton"),
  resetButton: document.querySelector("#resetButton"),
  moveCount: document.querySelector("#moveCount"),
  boatSideText: document.querySelector("#boatSideText"),
  selectionCount: document.querySelector("#selectionCount"),
  leftCount: document.querySelector("#leftCount"),
  rightCount: document.querySelector("#rightCount"),
  toast: document.querySelector("#toast"),
  ruleToggle: document.querySelector("#ruleToggle"),
  rules: document.querySelector("#rules"),
  winDialog: document.querySelector("#winDialog"),
  finalMoves: document.querySelector("#finalMoves"),
  playAgainButton: document.querySelector("#playAgainButton"),
};

const sideLabel = {
  left: "左岸",
  right: "右岸",
};

function render() {
  if (state.disembarkTarget && !state.selected.includes(state.disembarkTarget)) {
    state.disembarkTarget = null;
  }

  el.leftPeople.innerHTML = "";
  el.rightPeople.innerHTML = "";

  people.forEach((person) => {
    if (state.selected.includes(person.id)) {
      return;
    }

    const button = createPersonButton(person);
    if (person.side !== state.boatSide || state.isMoving) {
      button.disabled = true;
    }

    if (person.side === "left") {
      el.leftPeople.append(button);
    } else {
      el.rightPeople.append(button);
    }
  });

  renderBoatPassengers();
  updateHud();
}

function createPersonButton(person) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "person";
  button.dataset.id = person.id;
  button.style.setProperty("--avatar-bg", person.color);
  button.style.setProperty("--avatar-line", person.line);
  button.style.setProperty("--avatar-accent", person.accent);
  button.style.setProperty("--avatar-skin", person.skin);
  button.style.setProperty("--avatar-hair", person.hair);
  button.style.setProperty("--avatar-outfit", person.outfit);
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

function renderBoatPassengers() {
  const onboardProblem = findBoatPassengerProblem(state.selected.map(getPerson));

  el.boatButton.dataset.side = state.boatSide;
  el.boatButton.dataset.direction = opposite(state.boatSide);
  el.boatButton.classList.toggle("moving", state.isMoving);
  el.boatButton.classList.toggle("conflict", Boolean(onboardProblem));
  el.board.classList.toggle("has-boat-conflict", Boolean(onboardProblem));
  el.boatPassengers.innerHTML = "";

  state.selected.forEach((id) => {
    const person = getPerson(id);
    const mini = document.createElement("button");
    mini.type = "button";
    mini.className = "boat-mini";
    mini.dataset.id = person.id;
    mini.setAttribute("aria-label", `${person.boatLabel}を船から降ろす対象にする`);
    mini.classList.toggle("selected", state.disembarkTarget === person.id);
    mini.classList.toggle("danger", onboardProblem?.ids.includes(person.id));
    mini.style.setProperty("--avatar-bg", person.color);
    mini.style.setProperty("--avatar-line", person.line);
    mini.style.setProperty("--avatar-accent", person.accent);
    mini.style.setProperty("--avatar-skin", person.skin);
    mini.style.setProperty("--avatar-hair", person.hair);
    mini.style.setProperty("--avatar-outfit", person.outfit);
    mini.innerHTML = `
      <span class="boat-mini-label">${person.boatLabel}</span>
      <span class="boat-mini-icon">${personIcon(person)}</span>
    `;
    mini.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleDisembarkTarget(person.id);
    });
    el.boatPassengers.append(mini);
  });
}

function updateHud() {
  const leftTotal = people.filter((person) => person.side === "left").length;
  const rightTotal = people.filter((person) => person.side === "right").length;

  el.moveCount.textContent = state.moveCount;
  el.boatSideText.textContent = sideLabel[state.boatSide];
  el.selectionCount.textContent = `${state.selected.length} / 2`;
  el.leftCount.textContent = `${leftTotal}人`;
  el.rightCount.textContent = `${rightTotal}人`;
  el.crossButton.disabled = state.selected.length === 0 || state.isMoving;
  el.crossButton.classList.toggle("returning", state.boatSide === "right");
  el.clearButton.disabled = !state.disembarkTarget || state.isMoving;
}

function togglePerson(id) {
  if (state.isMoving) {
    return;
  }

  const person = getPerson(id);
  if (person.side !== state.boatSide) {
    showToast("舟がある岸の人だけを乗せられます。", "warn");
    return;
  }

  if (state.selected.includes(id)) {
    state.selected = state.selected.filter((selectedId) => selectedId !== id);
    if (state.disembarkTarget === id) {
      state.disembarkTarget = null;
    }
    render();
    return;
  }

  if (state.selected.length >= 2) {
    showToast("舟に乗れるのは2人までです。", "warn");
    return;
  }

  state.selected.push(id);
  state.disembarkTarget = null;
  render();
}

function toggleDisembarkTarget(id) {
  if (state.isMoving) {
    return;
  }

  state.disembarkTarget = state.disembarkTarget === id ? null : id;
  render();
}

function disembarkSelectedPassenger() {
  if (state.isMoving || !state.disembarkTarget) {
    return;
  }

  state.selected = state.selected.filter((id) => id !== state.disembarkTarget);
  state.disembarkTarget = null;
  render();
}

function tryCross() {
  if (state.isMoving) {
    return;
  }

  const validation = validateMove();
  if (!validation.ok) {
    showInvalid(validation);
    return;
  }

  crossRiver();
}

function validateMove() {
  if (state.selected.length === 0) {
    return {
      ok: false,
      message: "舟に乗る人を選んでください。",
      conflictIds: [],
    };
  }

  const passengers = state.selected.map(getPerson);
  const boatProblem = findBoatPassengerProblem(passengers);
  if (boatProblem) {
    return {
      ok: false,
      message: boatProblem.message,
      conflictIds: boatProblem.ids,
    };
  }

  const hasDriver = passengers.some((person) => person.driver);
  if (!hasDriver) {
    return {
      ok: false,
      message: "この二人では舟をこげません。父・母・召使いの誰かを乗せてください。",
      conflictIds: state.selected,
    };
  }

  const nextSide = opposite(state.boatSide);
  const snapshot = people.map((person) => ({
    ...person,
    side: state.selected.includes(person.id) ? nextSide : person.side,
  }));

  const safetyProblem = findSafetyProblem(snapshot);
  if (safetyProblem) {
    return {
      ok: false,
      message: safetyProblem.message,
      conflictIds: safetyProblem.ids,
    };
  }

  return { ok: true };
}

function findBoatPassengerProblem(passengers) {
  if (passengers.length < 2) {
    return null;
  }

  const types = new Set(passengers.map((person) => person.type));
  const ids = new Set(passengers.map((person) => person.id));

  if (types.has("father") && types.has("daughter") && !types.has("mother")) {
    return {
      message: "父と娘だけでは一緒に渡れません。父が娘を怒ってしまいます。",
      ids: passengers
        .filter((person) => person.type === "father" || person.type === "daughter")
        .map((person) => person.id),
    };
  }

  if (types.has("mother") && types.has("son") && !types.has("father")) {
    return {
      message: "母と息子だけでは一緒に渡れません。母が息子を怒ってしまいます。",
      ids: passengers
        .filter((person) => person.type === "mother" || person.type === "son")
        .map((person) => person.id),
    };
  }

  if (ids.has("dog") && !ids.has("maid") && passengers.some((person) => person.type !== "dog")) {
    return {
      message: "犬は召使いなしでは、家族の誰とも一緒に船に乗れません。",
      ids: passengers.map((person) => person.id),
    };
  }

  return null;
}

function findSafetyProblem(snapshot) {
  for (const side of ["left", "right"]) {
    const group = snapshot.filter((person) => person.side === side);
    const ids = new Set(group.map((person) => person.id));
    const types = new Set(group.map((person) => person.type));

    if (types.has("father") && types.has("daughter") && !types.has("mother")) {
      return {
        message: `${sideLabel[side]}で父と娘が母なしになります。父が娘を怒ってしまいます。`,
        ids: group
          .filter((person) => person.type === "father" || person.type === "daughter")
          .map((person) => person.id),
      };
    }

    if (types.has("mother") && types.has("son") && !types.has("father")) {
      return {
        message: `${sideLabel[side]}で母と息子が父なしになります。母が息子を怒ってしまいます。`,
        ids: group
          .filter((person) => person.type === "mother" || person.type === "son")
          .map((person) => person.id),
      };
    }

    if (ids.has("dog") && !ids.has("maid") && group.some((person) => person.type !== "dog")) {
      return {
        message: `${sideLabel[side]}で犬が召使いなしになります。家族の誰とも一緒に過ごせません。`,
        ids: group.filter((person) => person.id === "dog" || person.type !== "maid").map((person) => person.id),
      };
    }
  }

  return null;
}

function showInvalid(validation) {
  markConflict(validation.conflictIds);
  markBoatConflict();
  showToast(validation.message, "warn");
}

function markConflict(ids) {
  ids.forEach((id) => {
    const button = document.querySelector(`.person[data-id="${id}"]`);
    if (!button) {
      const mini = document.querySelector(`.boat-mini[data-id="${id}"]`);
      if (!mini) {
        return;
      }

      mini.classList.remove("danger");
      window.requestAnimationFrame(() => mini.classList.add("danger"));
      return;
    }

    button.classList.remove("danger");
    window.requestAnimationFrame(() => button.classList.add("danger"));
  });
}

function markBoatConflict() {
  if (state.selected.length === 0) {
    return;
  }

  el.boatButton.classList.remove("danger");
  window.requestAnimationFrame(() => el.boatButton.classList.add("danger"));
  window.setTimeout(() => el.boatButton.classList.remove("danger"), 520);
}

function crossRiver() {
  state.isMoving = true;
  render();

  const nextSide = opposite(state.boatSide);
  el.boatButton.dataset.side = nextSide;
  el.boatButton.dataset.direction = nextSide;

  window.setTimeout(() => {
    state.selected.forEach((id) => {
      getPerson(id).side = nextSide;
    });

    state.boatSide = nextSide;
    state.selected = [];
    state.disembarkTarget = null;
    state.moveCount += 1;
    state.isMoving = false;
    render();

    if (people.every((person) => person.side === "right")) {
      showWin();
    }
  }, 650);
}

function showWin() {
  el.finalMoves.textContent = state.moveCount;
  showToast("全員が右岸に到着しました。", "good");

  if (typeof el.winDialog.showModal === "function") {
    el.winDialog.showModal();
  }
}

function resetGame() {
  people.forEach((person) => {
    person.side = "left";
  });

  state.boatSide = "left";
  state.selected = [];
  state.disembarkTarget = null;
  state.moveCount = 0;
  state.isMoving = false;

  if (el.winDialog.open) {
    el.winDialog.close();
  }

  render();
}

function showToast(message, tone) {
  window.clearTimeout(state.toastTimer);
  el.toast.textContent = message;
  el.toast.classList.toggle("good", tone === "good");
  el.toast.classList.add("show");
  state.toastTimer = window.setTimeout(() => {
    el.toast.classList.remove("show");
  }, 2800);
}

function getPerson(id) {
  return people.find((person) => person.id === id);
}

function opposite(side) {
  return side === "left" ? "right" : "left";
}

function personIcon(person) {
  const icons = {
    father: `
      <path class="outfit" d="M14 58c2.7-13.1 9.1-19.1 18-19.1S47.3 44.9 50 58z" />
      <path class="accent" d="M29 41h6l-1.5 17h-3z" />
      <circle class="skin" cx="32" cy="24" r="12.2" />
      <path class="hair" d="M19.9 22.9c1.1-9 7.7-13.4 15.6-11.7 5.3 1.2 8.4 5.1 8.8 10.7-5.9-4.2-14.5-4.5-24.4 1z" />
      <circle class="stroke" cx="27" cy="25" r="3.2" stroke-width="2.6" />
      <circle class="stroke" cx="37" cy="25" r="3.2" stroke-width="2.6" />
      <path class="stroke" d="M30.2 25h3.6M28.5 32.2c2.2 1.7 5.1 1.7 7.2 0" stroke-width="2.4" />
      <path class="white" d="M24 44.2 32 40l8 4.2-8 4.3z" />
    `,
    mother: `
      <path class="outfit" d="M13.5 58c3-12.8 9.2-18.7 18.5-18.7S47.5 45.2 50.5 58z" />
      <path class="hair" d="M17.8 28.3c-2.1-9.2 3.5-17.2 13.9-17.2 10.3 0 16.7 8.8 14 18.1-3.7-7.6-10.6-11.1-19.4-8.9-3.8 1-6.4 3.8-8.5 8z" />
      <circle class="skin" cx="32" cy="25" r="11.4" />
      <path class="accent" d="M20.7 18.6c4.2-5.2 14.7-7.1 21.5 2.5-8.4-3.7-15.8-3.2-21.5-2.5z" />
      <circle class="accent" cx="20.2" cy="31" r="2.4" />
      <circle class="accent" cx="43.8" cy="31" r="2.4" />
      <path class="stroke" d="M26.5 25.5h.1M37.5 25.5h.1M28.5 32.5c2.1 1.8 5.1 1.8 7 0" stroke-width="3" />
      <path class="white" d="M27.4 41.5 32 46l4.6-4.5 5.8 6.9H21.6z" />
    `,
    "son-cap": `
      <path class="outfit" d="M13.8 58c2.6-12.1 8.9-17.9 18.2-17.9S47.6 45.9 50.2 58z" />
      <circle class="skin" cx="32" cy="26" r="10.8" />
      <path class="hair" d="M21.1 24c.5-6.3 4.9-10.5 11.6-10.5 5.5 0 9.2 3.2 10.3 8.9-4-2.4-10.7-3.8-21.9 1.6z" />
      <path class="accent" d="M20.2 18.8c2.9-5.5 9-7.4 15.8-5.5 3.5 1 6 3.2 7.7 6.4-8.7-2.2-16.6-2.4-23.5-.9z" />
      <path class="accent" d="M41.3 19.4h7.2c-1.8 2.4-4.7 3.6-8.7 3.4z" />
      <path class="stroke" d="M27 27h.1M37 27h.1M28 33.1c2.5 2 5.4 2 8 0" stroke-width="3" />
      <path class="white" d="M24.2 43.5h15.6l-2.2 6.1H26.4z" />
    `,
    "son-headphones": `
      <path class="outfit" d="M13.5 58c2.8-12.3 9.2-18.1 18.5-18.1S47.7 45.7 50.5 58z" />
      <circle class="skin" cx="32" cy="26" r="10.8" />
      <path class="hair" d="M21.2 23.5c1.2-7 6.7-10.8 13.8-9.5 4.9.9 7.7 4.4 8.1 9.3-7.3-3.9-14.7-3.8-21.9.2z" />
      <path class="stroke" d="M21 28v-3.5c0-6.1 4.2-10.7 11-10.7s11 4.6 11 10.7V28" stroke-width="2.8" />
      <rect class="accent" x="17.5" y="25.5" width="5.9" height="10.2" rx="2.3" />
      <rect class="accent" x="40.6" y="25.5" width="5.9" height="10.2" rx="2.3" />
      <path class="stroke" d="M27 27h.1M37 27h.1M28.5 33.2c2.2 1.6 4.8 1.6 7 0" stroke-width="3" />
      <path class="white" d="M23.5 43.7 32 40l8.5 3.7L32 48.5z" />
    `,
    "daughter-bow": `
      <path class="outfit" d="M13.7 58c2.8-12.2 9.1-18.1 18.3-18.1S47.5 45.8 50.3 58z" />
      <path class="hair" d="M19.2 29.5c-2.2-9.4 3.5-16.2 12.8-16.2s15 6.8 12.8 16.2c-4.6-6.5-9.9-8.7-12.8-8.7s-8.2 2.2-12.8 8.7z" />
      <circle class="skin" cx="32" cy="27" r="10.7" />
      <path class="accent" d="M25.2 12.6 32 17l6.8-4.4v9L32 17l-6.8 4.6z" />
      <circle class="hair" cx="18.7" cy="32" r="4.2" />
      <circle class="hair" cx="45.3" cy="32" r="4.2" />
      <path class="stroke" d="M27.2 27.6h.1M36.8 27.6h.1M28.2 33.9c2.3 1.9 5.3 1.9 7.6 0" stroke-width="3" />
      <path class="white" d="M25.2 43.5 32 39.8l6.8 3.7-6.8 5z" />
    `,
    "daughter-pigtails": `
      <path class="outfit" d="M13.6 58c2.8-12.2 9.1-18 18.4-18s15.6 5.8 18.4 18z" />
      <path class="hair" d="M20.6 28.8c-1.9-8.6 3.2-15.2 11.4-15.2s13.3 6.6 11.4 15.2c-5.7-6-17.1-6-22.8 0z" />
      <circle class="skin" cx="32" cy="27" r="10.5" />
      <circle class="hair" cx="19" cy="32.2" r="4.8" />
      <circle class="hair" cx="45" cy="32.2" r="4.8" />
      <path class="accent" d="M18.2 35.1 14 38.3l.4-5.3zM45.8 35.1l4.2 3.2-.4-5.3z" />
      <path class="stroke" d="M27.2 27.5h.1M36.8 27.5h.1M28.4 33.8c2.1 1.7 5.1 1.7 7.2 0" stroke-width="3" />
      <path class="white" d="M24.5 43.7h15l-2.6 6.3h-9.8z" />
    `,
    maid: `
      <path class="outfit" d="M12.8 58c3-13 9.5-19 19.2-19s16.2 6 19.2 19z" />
      <path class="hair" d="M19.2 28.7c-1.7-9.1 3.6-15.7 12.8-15.7s14.5 6.6 12.8 15.7c-4.9-5.7-20.7-5.7-25.6 0z" />
      <path class="white" d="M19.5 17.7c1.7-5 6.5-8.2 12.5-8.2s10.8 3.2 12.5 8.2c-8.5-2.7-16.5-2.7-25 0z" />
      <circle class="skin" cx="32" cy="27" r="10.7" />
      <path class="white" d="M24.2 42.8 32 39l7.8 3.8-2.9 11.4h-9.8z" />
      <path class="accent" d="M22 46.4h20l1.8 11.6H20.2z" opacity=".65" />
      <path class="stroke" d="M27 27.5h.1M37 27.5h.1M28.8 33.5c2 1.5 4.4 1.5 6.4 0" stroke-width="3" />
    `,
    dog: `
      <path class="hair" d="M14.5 24 10 14l12 4zM49.5 24 54 14l-12 4z" />
      <path class="outfit" d="M17.5 30.3c0-9.4 5.5-15.3 14.5-15.3s14.5 5.9 14.5 15.3v7c0 7.2-5.6 12.1-14.5 12.1s-14.5-4.9-14.5-12.1z" />
      <path class="skin" d="M24.5 40.4c2.5 6 12.5 6 15 0-2.2 2.1-5 3.1-7.5 3.1s-5.3-1-7.5-3.1z" />
      <circle class="dark" cx="26.8" cy="31.7" r="2.2" />
      <circle class="dark" cx="37.2" cy="31.7" r="2.2" />
      <path class="dark" d="M29.2 37.3c1.3-1.3 4.3-1.3 5.6 0-1.1 2.4-4.5 2.4-5.6 0z" />
      <path class="stroke" d="M28.8 42.2c1.9 1.5 4.5 1.5 6.4 0" stroke-width="2.8" />
      <path class="accent" d="M24 19.2c3.1-4.4 12.9-4.4 16 0-6.1-2-10-2-16 0z" />
    `,
  };

  return `<svg aria-hidden="true" viewBox="0 0 64 64">${icons[person.icon]}</svg>`;
}

function boatIcon() {
  return `
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 13h16l-2.4 5H6.4z" />
      <path d="M8 13V7l5 3-5 3" />
      <path d="M4 20c1.6.8 3.2.8 4.8 0 1.6.8 3.2.8 4.8 0 1.6.8 3.2.8 4.8 0" />
    </svg>
  `;
}

el.crossButton.addEventListener("click", tryCross);
el.boatButton.addEventListener("click", tryCross);
el.boatButton.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  tryCross();
});
el.clearButton.addEventListener("click", disembarkSelectedPassenger);
el.resetButton.addEventListener("click", resetGame);
el.playAgainButton.addEventListener("click", resetGame);
el.ruleToggle.addEventListener("click", () => {
  const isOpen = el.rules.classList.toggle("open");
  el.ruleToggle.setAttribute("aria-expanded", String(isOpen));
});

render();
