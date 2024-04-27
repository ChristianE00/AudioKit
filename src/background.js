// Listen for tab changes
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        chrome.storage.sync.get(tab.id, function(data) {
            if (data[tab.id] === undefined) {
                // No existing volume setting for this tab, set it to 100
                chrome.storage.sync.set({ [tab.id]: 100 });
            }
        });
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.active) {
        chrome.storage.sync.get(tab.id, function(data) {
            let volume = data[tab.id] !== undefined ? data[tab.id] : 100;
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
        chrome.storage.sync.get(sender.tab.id, function(data) {
            let volume = data[sender.tab.id] !== undefined ? data[sender.tab.id] : 100;
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