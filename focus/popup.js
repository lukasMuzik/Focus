const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");

const workTimeInput = document.getElementById("work-time");
const timeLeftSpan = document.querySelector(".time-left");

let interval;
let remainingWorkTimeInSeconds = 0;

function initTimer() {
  chrome.storage.local.get("targetTime", ({ targetTime }) => {
    if (targetTime) {
      const currentTime = Math.floor(new Date().getTime() / 1000);
      remainingWorkTimeInSeconds = targetTime - currentTime;

      if (interval) {
        clearInterval(interval);
        interval = null;
      }

      updateUi();

      interval = setInterval(() => {
        if (remainingWorkTimeInSeconds <= 0) {
          clearInterval(interval);
          alert("Time's up!");
          return;
        }

        remainingWorkTimeInSeconds--;
        updateUi();
      }, 1000);
    }
  });
}

initTimer();

startButton.addEventListener("click", () => {
  remainingWorkTimeInSeconds = getInputWorkTimeInSeconds();

  const targetTime =
    Math.floor(new Date().getTime() / 1000) + remainingWorkTimeInSeconds;
  chrome.storage.local.set({ targetTime });

  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  interval = setInterval(() => {
    if (remainingWorkTimeInSeconds <= 0) {
      clearInterval(interval);
      alert("Time's up!");
      return;
    }

    remainingWorkTimeInSeconds--;
    updateUi();
  }, 1000);
});

stopButton.addEventListener("click", () => {
  chrome.storage.local.remove("targetTime");
  clearInterval(interval);
  interval = null;
  remainingWorkTimeInSeconds = getInputWorkTimeInSeconds();
  updateUi();
});

resetButton.addEventListener("click", () => {
  clearInterval(interval);
  remainingWorkTimeInSeconds = getInputWorkTimeInSeconds();

  interval = setInterval(() => {
    console.log(interval);
    if (remainingWorkTimeInSeconds <= 0) {
      clearInterval(interval);
      alert("Time's up!");
      return;
    }

    remainingWorkTimeInSeconds--;
    updateUi();
  }, 1000);
});

function updateUi() {
  timeLeftSpan.textContent = `${Math.floor(remainingWorkTimeInSeconds / 60)}:${
    remainingWorkTimeInSeconds % 60
  }`;
}

function getInputWorkTimeInSeconds() {
  return workTimeInput.value * 60;
}
