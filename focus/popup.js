const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const workTimeInput = document.getElementById("work-time");
const timeLeftSpan = document.querySelector(".time-left");

let interval;
let workTimeInSeconds = 0;

startButton.addEventListener("click", () => {
  console.log("Start button clicked");

  const workTime = workTimeInput.value;
  workTimeInSeconds = workTime * 60;

  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  interval = setInterval(() => {
    console.log(interval);
    if (workTimeInSeconds <= 0) {
      clearInterval(interval);
      alert("Time's up!");
      return;
    }

    workTimeInSeconds--;
    timeLeftSpan.textContent = `${Math.floor(workTimeInSeconds / 60)}:${
      workTimeInSeconds % 60
    }`;
  }, 1000);
});

stopButton.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
  const workTime = workTimeInput.value;
  workTimeInSeconds = workTime * 60;
  timeLeftSpan.textContent = `${Math.floor(workTimeInSeconds / 60)}:${
    workTimeInSeconds % 60
  }`;
});

resetButton.addEventListener("click", () => {
  clearInterval(interval);
  const workTime = workTimeInput.value;
  workTimeInSeconds = workTime * 60;

  interval = setInterval(() => {
    console.log(interval);
    if (workTimeInSeconds <= 0) {
      clearInterval(interval);
      alert("Time's up!");
      return;
    }

    workTimeInSeconds--;
    timeLeftSpan.textContent = `${Math.floor(workTimeInSeconds / 60)}:${
      workTimeInSeconds % 60
    }`;
  }, 1000);
});
