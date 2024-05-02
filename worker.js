
console.log("Worker is running");



const activeStreams = new Map();
// Messages from the popup
chrome.runtime.onMessage.addListener(async (msg) => {
  console.log("Message received from popup");
  switch (msg.type) {
    case "popup-loaded":
      let t = await getCurrentTab();
      var level = getTabLevel(t.id);
      console.log("[SERVICE-WORKER] Popup loaded message received sedning level: ", level);
      chrome.runtime.sendMessage({ type: 'popup-level', level: level});
      break;
    /*
    case "play":
      console.log("Play message received");
      let currTab = await getCurrentTab();
      console.log("Current tab is: ", currTab.id);
      await updateTabVolume(currTab.id, 0.5);
      break;
    */
    case "adjust-level":
      console.log("[SERVICE-WORKER] Adjust level message received");
      var currTab = await getCurrentTab();
      await updateTabVolume(currTab.id, msg.level);
      break;
  }
});


async function updateTabVolume(tabId, volume){
    // Check if the offscreen document already exists
    if (await chrome.offscreen.hasDocument()) {
    }
    else{
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        //reasons: ['AUDIO_PLAYBACK'],
        reasons: ['USER_MEDIA'],
        justification: 'Adjust tab audio volume'
      });
      console.log("Created offscreen document");
    }

    if (activeStreams.has(tabId)){
      chrome.runtime.sendMessage({ type: 'adjust-level', target: 'offscreen', tabId: tabId, level: volume});
    }
    else{
      // Get a MediaStream for the Active Tab
      const streamId = await chrome.tabCapture.getMediaStreamId({
        targetTabId: tabId
      });
      
      // Send the stream ID to the offscreen document to start recording
      chrome.runtime.sendMessage({ type: 'start-recording', target: 'offscreen', data: streamId, tabId: tabId, level: volume});
    }

      // Save the stream ID to the activeStreams Map
      activeStreams.set(tabId, volume);
}


async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  //console.log("Current tab is: ", tab);
  return tab;
}

function getTabLevel(tabId){
  let level = 100;
  if (activeStreams.has(tabId)){
    level = activeStreams.get(tabId) * 100;

  }
  return level;
}


