const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");

const workTimeInput = document.getElementById("work-time");
const timeLeftSpan = document.querySelector(".time-left");

let interval;
let remainingWorkTimeInSeconds = 0;

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.targetTime) {
    if (!changes.targetTime.newValue) {
      clearInterval(interval);
      interval = null;
      remainingWorkTimeInSeconds = getInputWorkTimeInSeconds();
      updateTimerDisplay();
    }
  }
});

function startCountdown() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  interval = setInterval(() => {
    remainingWorkTimeInSeconds--;
    updateTimerDisplay();

    if (remainingWorkTimeInSeconds <= 0) {
      clearInterval(interval);
    }
  }, 1000);
}

function initTimer() {
  chrome.storage.local.get("targetTime", ({ targetTime }) => {
    if (targetTime) {
      const currentTime = Math.floor(new Date().getTime() / 1000);
      remainingWorkTimeInSeconds = targetTime - currentTime;

      updateTimerDisplay();
      startCountdown();
    }
  });
}

function scheduleCompletionAlarm() {
  chrome.alarms.create("focusTimer", {
    delayInMinutes: getInputWorkTimeInSeconds() / 60,
  });
}

function saveTargetTimestamp() {
  const targetTime =
    Math.floor(new Date().getTime() / 1000) + remainingWorkTimeInSeconds;
  chrome.storage.local.set({ targetTime });
}

function updateTimerDisplay() {
  timeLeftSpan.textContent = `${Math.floor(remainingWorkTimeInSeconds / 60)}:${
    remainingWorkTimeInSeconds % 60
  }`;
}

function getInputWorkTimeInSeconds() {
  return workTimeInput.value * 60;
}

function handleStartTimer() {
  remainingWorkTimeInSeconds = getInputWorkTimeInSeconds();

  scheduleCompletionAlarm();

  saveTargetTimestamp();

  startCountdown();
}

function handleStopTimer() {
  chrome.alarms.clear("focusTimer");
  chrome.storage.local.remove("targetTime");
}

startButton.addEventListener("click", handleStartTimer);
resetButton.addEventListener("click", handleStartTimer);
stopButton.addEventListener("click", handleStopTimer);

initTimer();
