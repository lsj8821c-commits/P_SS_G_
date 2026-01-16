const player = document.getElementById("player");
const stageEl = document.getElementById("stage");
const staminaEl = document.getElementById("stamina");
const inventoryEl = document.getElementById("inventory");
const logEl = document.getElementById("log");
const resetButton = document.getElementById("reset");

const world = document.querySelector(".world");
const zones = [...document.querySelectorAll(".zone")];

const state = {
  stamina: 50,
  inventory: [],
  stageIndex: 0,
  completed: false,
  position: { x: 40, y: 80 },
};

const stages = [
  {
    key: "home",
    label: "집",
    message: "집에서 가볍게 워밍업을 시작합니다.",
  },
  {
    key: "river",
    label: "강",
    message: "강을 건너며 호흡을 정리합니다.",
  },
  {
    key: "cafe",
    label: "카페",
    message: "카페에서 에스프레소를 마시고 스태미나가 회복됩니다.",
    effect: () => updateStamina(30),
  },
  {
    key: "shop",
    label: "트레일 러닝 샵",
    message: "부스트와 등산 스틱을 구매했습니다!",
    effect: () => updateInventory(["부스트", "등산 스틱"]),
  },
  {
    key: "mountain",
    label: "산",
    message: "산길로 올라가며 부스트를 사용해 속도를 냅니다.",
    effect: () => updateStamina(-10),
  },
  {
    key: "pavilion",
    label: "팔각정",
    message: "팔각정에서 노을을 보며 오늘의 러닝이 끝났습니다!",
  },
];

const keys = new Set();

function updateStage() {
  stageEl.textContent = stages[state.stageIndex]?.label ?? "완료";
}

function updateStamina(amount) {
  state.stamina = Math.max(0, Math.min(100, state.stamina + amount));
  staminaEl.textContent = String(state.stamina);
}

function updateInventory(items) {
  state.inventory = [...new Set([...state.inventory, ...items])];
  inventoryEl.textContent = state.inventory.length ? state.inventory.join(", ") : "없음";
}

function logMessage(text) {
  const entry = document.createElement("li");
  entry.textContent = text;
  logEl.appendChild(entry);
}

function setPlayerPosition(x, y) {
  const bounds = world.getBoundingClientRect();
  const maxX = bounds.width - 32;
  const maxY = bounds.height - 32;

  state.position.x = Math.max(0, Math.min(maxX, x));
  state.position.y = Math.max(0, Math.min(maxY, y));
  player.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`;
}

function checkStageCompletion() {
  if (state.completed) {
    return;
  }

  const current = stages[state.stageIndex];
  if (!current) {
    return;
  }

  const zone = zones.find((item) => item.dataset.zone === current.key);
  if (!zone) {
    return;
  }

  const playerRect = player.getBoundingClientRect();
  const zoneRect = zone.getBoundingClientRect();

  const isInside =
    playerRect.left < zoneRect.right &&
    playerRect.right > zoneRect.left &&
    playerRect.top < zoneRect.bottom &&
    playerRect.bottom > zoneRect.top;

  if (isInside) {
    logMessage(current.message);
    current.effect?.();
    state.stageIndex += 1;
    updateStage();

    if (state.stageIndex >= stages.length) {
      state.completed = true;
      logMessage("축하합니다! 러너의 하루를 완주했습니다.");
    }
  }
}

function handleMovement() {
  if (state.completed) {
    return;
  }

  const speed = state.inventory.includes("부스트") ? 4 : 3;
  let dx = 0;
  let dy = 0;

  if (keys.has("ArrowUp") || keys.has("w")) {
    dy -= speed;
  }
  if (keys.has("ArrowDown") || keys.has("s")) {
    dy += speed;
  }
  if (keys.has("ArrowLeft") || keys.has("a")) {
    dx -= speed;
  }
  if (keys.has("ArrowRight") || keys.has("d")) {
    dx += speed;
  }

  if (dx !== 0 || dy !== 0) {
    setPlayerPosition(state.position.x + dx, state.position.y + dy);
    checkStageCompletion();
  }

  requestAnimationFrame(handleMovement);
}

function resetGame() {
  state.stamina = 50;
  state.inventory = [];
  state.stageIndex = 0;
  state.completed = false;
  state.position = { x: 40, y: 80 };

  logEl.innerHTML = "";
  updateStage();
  updateStamina(0);
  updateInventory([]);
  setPlayerPosition(state.position.x, state.position.y);
  logMessage("집에서 하루를 다시 시작합니다.");

  requestAnimationFrame(handleMovement);
}

window.addEventListener("keydown", (event) => {
  keys.add(event.key);
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key);
});

resetButton.addEventListener("click", resetGame);

updateStage();
updateStamina(0);
updateInventory([]);
logMessage("집에서 하루를 시작합니다.");
setPlayerPosition(state.position.x, state.position.y);
requestAnimationFrame(handleMovement);
