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

// --- Blocking Logic ---

const BLOCKED_SITES = [
  "youtube.com",
  "youtu.be",
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "reddit.com",
];

function setBlocking(enabled) {
  chrome.declarativeNetRequest.getDynamicRules((previousRules) => {
    const previousRuleIds = previousRules.map((rule) => rule.id);

    const rules = enabled
      ? BLOCKED_SITES.map((domain, index) => ({
          id: index + 1,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: `||${domain}`,
            resourceTypes: [
              "main_frame",
              "sub_frame",
              "xmlhttprequest",
              "script",
            ],
          },
        }))
      : [];

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: previousRuleIds,
      addRules: rules,
    });
  });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.targetTime) {
    if (changes.targetTime.newValue) {
      console.log("Blocking enabled");
      setBlocking(true);
    } else {
      console.log("Blocking disabled");
      setBlocking(false);
    }
  }
});
