// Listen for tab changes
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.storage.sync.set({ [activeInfo.tabId]: 100 });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.active) {
        chrome.storage.sync.get(String(tabId), function(data) {
            let volume = data[tabId] !== undefined ? data[tabId] : 100;
            console.log("NEW PAGE LOADED OR REFRESHED DETECTED volume: ", volume);
            updateVolume(volume, tabId);
        });
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command === "background") {
        console.log("background received volume command VOLUME: ", request.level, " TAB: ", request.tab);
        updateVolume(request.level, request.tab);
    }
    else if(request.command === "getTabInfo"){
        let tabId = sender.tab.id;
        chrome.storage.sync.get(String(tabId), function(data) {
            let volume = data[tabId] !== undefined ? data[tabId] : 100;
            console.log("New audio source detected volume: ", volume);
            sendResponse({volume: volume});
        });
        return true;
    }
});

function updateVolume(level, tabId) {
    console.log("Volume: " + level);
    const messaging = chrome.tabs.sendMessage || browser.tabs.sendMessage;
    messaging(tabId, { command: "volume", level: level }, function(response) {
        console.log(response);
    });
}