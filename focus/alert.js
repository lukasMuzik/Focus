chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "focusTimer") {
    chrome.storage.local.remove("targetTime");

    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("icon.png"),
      title: "Time is up!",
      message: "Your focus session has ended.",
    });

    chrome.tabs.create({ url: "finished.html" });
  }
});
