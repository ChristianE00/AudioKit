// TODO: 5/15/24
// Get Audio-Enhancement inplemented



function worker(a, b) {

    return a + b;

}

function sum(a, b) {
    return a + b;
}

module.exports = { worker, sum, getTabLevel, containsTab, getCurrentTab};

// Clear previous session ids.
chrome.runtime.onStartup.addListener(function() {
  console.log("Browser opened CLEARING CACHE");
  chrome.storage.local.clear();


});


const activeStreams = new Map();
// Messages from the popup
chrome.runtime.onMessage.addListener(async (msg) => {
  console.log("Message received from popup");
  switch (msg.type) {
    case "popup-loaded":
      //await chrome.storage.local.clear();
      let t = await getCurrentTab();
      var level = await getTabLevel(t.id);
      console.log("[SERVICE-WORKER] Get tab title message received");
      var arr = await getCurrentTabTitleAndSound();
			var title = arr[0];
			var audible = arr[1];
      console.log("[SERVICE-WORKER] Popup loaded message received sending level: ", level);
      chrome.runtime.sendMessage({ type: 'popup-level', level: level, title: title, audible : audible });
      break;
  case "adjust-level":

      console.log("[SERVICE-WORKER] Adjust level message received");
      var currTab = await getCurrentTab();
      await updateTabVolume(currTab.id, msg.level);
      break;

    case "testSave":
      console.log("[SERVICE-WORKER] Test save message received");
      var currTab = await getCurrentTab();
      await testSave(currTab.id);
      break;

    case "testGet":
      console.log("[SERVICE-WORKER] Test get message received");
      var currTab = await getCurrentTab();
      await testGet(currTab.id);
      break;

    case "getTabTitle":


      break;

    case "clear-storage":
      console.log("[SERVICE-WORKER] Clear storage message received");
      await chrome.storage.local.clear();
      break;

    case "lowshelf-worker":
      console.log("[SERVICE-WORKER] Lowshelf message received");
      var currTab = await getCurrentTab();
      await lowshelf(currTab.id);
      break;

    case "highshelf-worker":
      console.log("[SERVICE-WORKER] Highshelf message received");
      var currTab = await getCurrentTab();
      await highshelf(currTab.id);
      break;
    case "default-worker":
      console.log("[SERVICE-WORKER] Default message received");
      var currTab = await getCurrentTab();
      await reset(currTab.id);
      break;
  }
});

  

async function reset(tabId){
    if(await containsTab(tabId)){
      chrome.runtime.sendMessage({ type: 'default', target: 'offscreen', tabId: tabId});
        await saveTabLevel(tabId, 1);
        chrome.runtime.sendMessage({ type: 'popup-level', level: 100});
    }
    

}

async function getCurrentTabTitleAndSound() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // Extract the first element in the array and store it in 'tab', discard the rest
  let [tab] = await chrome.tabs.query(queryOptions);
  let title = "No active tab found.";
	let audible = "False";
  if (tab) {
    console.log(` Title: ${tab.title}`);
    title = tab.title;
		if (tab.audible){
			audible = "True";
		}
  } else {
    console.log("No active tab found.");
  }
  return [title, audible];
}

async function removeTab(tabId){
    let items = await chrome.storage.local.get('levels');
    if(items.levels != null && items.levels[tabId] != null){
        delete items.levels[tabId];
        await chrome.storage.local.set({levels: items.levels});

    }

}

async function saveTabLevel(tabId, level){
  let items = await chrome.storage.local.get('levels');
  let tabLevels = null;
  // If levels is null, create a new object
  if (items.levels == null){
    tabLevels = {
      [tabId]: level
    };
  }
  // Otherwise, update the existing object
  else{
    tabLevels = items.levels;
    tabLevels[tabId] = level;
  }

  await chrome.storage.local.set({levels: tabLevels});
}

async function containsTab(tabId){
  let items = await chrome.storage.local.get('levels');
  let tabLevels = items.levels;
  if (tabLevels == null || tabLevels[tabId] == null){
    return false;
  }
  console.log('tablevels: ' + tabLevels);
  return true;
}

async function getTabLevel(tabId){
  let items = await chrome.storage.local.get('levels');
  let tabLevels = items.levels;
  
  // If level for current tab is not found, return 100
  if (!(await containsTab(tabId)) || tabLevels[tabId] < 0){
    console.log("!!Level not found for tabId: ", tabId);
    return 100;
  }
  else{
    
    console.log("!!Level found for tabId: ", tabId);
    return tabLevels[tabId] * 100;
  }
}

// Create offscreen document if it doesn't exist
async function createOffscreenDocument(){
    // OFFSCREEN document
    if (await chrome.offscreen.hasDocument()) {
      console.log("Offscreen document already exists");
    }
    else{
      console.log("Creating offscreen document");
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        //reasons: ['AUDIO_PLAYBACK'],
        reasons: ['USER_MEDIA'],
        justification: 'Adjust tab audio volume'
      });
      console.log("Created offscreen document");
    }
}


// Adjust bass frequencies with lowshelf filter
async function lowshelf(tabId){
  console.log("[SERVICE-WORKER] Lowshelf function called");
  await createOffscreenDocument();
  let tabIdS = tabId.toString();

  if (await containsTab(tabIdS)){
    chrome.runtime.sendMessage({ type: 'lowshelf', target: 'offscreen', tabId: tabId});
  }
  else{
    console.log("[SERVICE-WORKER] tab not found in activeStreams W/ tabId: ", tabId);
    const streamId = await chrome.tabCapture.getMediaStreamId({
      targetTabId: tabId
    });
    // Send the stream ID to the offscreen document to start recording
    chrome.runtime.sendMessage({ type: 'lowshelf-start', target: 'offscreen', data: streamId, tabId: tabId});
    await saveTabLevel(tabIdS, 1);

  }
}

// Adjust frequencies for highshelf filter
async function highshelf(tabId){
  console.log("[SERVICE-WORKER] Highshelf function called");
  await createOffscreenDocument();
  let tabIdS = tabId.toString();
  
  if (await containsTab(tabIdS)){
    chrome.runtime.sendMessage({ type: 'highshelf', target: 'offscreen', tabId: tabId});
  }
  else {
    console.log("[SERVICE-WORKER] tab not found in activeStreams W/ tabId: ", tabId);
    const streamId = await chrome.tabCapture.getMediaStreamId({
      targetTabId: tabId
    });
    // Send the stream ID to the offscreen document to start recording
    chrome.runtime.sendMessage({ type: 'highshelf-start', target: 'offscreen', data: streamId, tabId: tabId});
    await saveTabLevel(tabIdS, 1);
  }



}


async function updateTabVolume(tabId, volume){
  await createOffscreenDocument();
  let tabIdS = tabId.toString();
  let volumeS = volume.toString();
  // Tab already exits
  if(await containsTab(tabIdS)){
    console.log("[WORKER] tab found in activeStreams W/ tabId: ", tabId, " volume: ", volume);
    chrome.runtime.sendMessage({ type: 'adjust-level', target: 'offscreen', tabId: tabId, level: volume});
    await saveTabLevel(tabIdS, volumeS);
  }
  // Tab doesn't exist
  else{
    console.log("[WORKER] tab not found in activeStreams W/ tabId: ", tabId, " volume: ", volume);
    // Get a MediaStream for the Active Tab
    const streamId = await chrome.tabCapture.getMediaStreamId({
      targetTabId: tabId
    });
    // Send the stream ID to the offscreen document to start recording
    chrome.runtime.sendMessage({ type: 'start-recording', target: 'offscreen', data: streamId, tabId: tabId, level: volume});
    await saveTabLevel(tabIdS, volumeS);
  }
  console.log("BEFORE");
  await getCurrentTabTitle();
  console.log("AFTER");
}

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
