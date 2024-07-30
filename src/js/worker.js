
function worker(a, b) {

    return a + b;

}

function sum(a, b) {
    return a + b;
}

module.exports = { worker, sum, getTabLevel, containsTab, getCurrentTab };


// Clear previous session ID's.
chrome.runtime.onStartup.addListener(function() {
  console.log("Browser opened CLEARING CACHE");
  chrome.storage.local.clear();
});


const activeStreams = new Map();
// Messages from the popup
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  let currTab;
  let muted;
  switch (msg.type) {
    case "get-tab-id":
      currTab = await getCurrentTab();
      sendResponse({data: "Here's your data!"});
      break;
    case "openPopup":
      // ! Need to handle case where popup is already open -- currently throws exception, but handles gracefully
      console.log("[SERVICE-WORKER] Open popup message received");
      chrome.action.openPopup();
      break;
    case "popup-loaded":
      let t = await getCurrentTab();
      let level = await getTabLevel(t.id);
      let arr = await getCurrentTabTitleAndSound();
      let title = arr[0];
      let audible = arr[1];
      muted = arr[2];
      await getAllTabTitlesAndSounds();
      chrome.runtime.sendMessage({ type: 'popup-level', level: level, title: title, audible : audible, muted : muted });
      break;
    case "toggle-mute":
      console.log("[SERVICE-WORKER] Toggle mute message received");
      muted = await toggleMuteState();
      chrome.runtime.sendMessage({ type: 'tab-muted', muted: muted });
      break;
    case "mute-all":
      await allTabMuteState(true);
      chrome.runtime.sendMessage ( {type: 'tab-muted', muted: "true"});
      break;
    case "unmute-all":
        await allTabMuteState(false);
        chrome.runtime.sendMessage ( {type: 'tab-muted', muted: "false"});
        break;
    case "adjust-level":
      currTab = await getCurrentTab();
      await updateTabVolume(currTab.id, msg.level);
      break;
    case "clear-storage":
      await chrome.storage.local.clear();
      break;
    case "lowshelf-worker":
      currTab = await getCurrentTab();
      await lowshelf(currTab.id);
      break;
    case "highshelf-worker":
      currTab = await getCurrentTab();
      await highshelf(currTab.id);
      break;
    case "testSave":
      currTab = await getCurrentTab();
      await testSave(currTab.id);
      break;
    case "testGet":
      currTab = await getCurrentTab();
      await testGet(currTab.id);
      break;
    case "default-worker":
      currTab = await getCurrentTab();
      await reset(currTab.id);
      break;
  }
});


/**
 * Sets tab audio level back to the default level, 100%
 * @param {string} tabId 
 *
 */
async function reset(tabId){
    if(await containsTab(tabId)){
      chrome.runtime.sendMessage({ type: 'default', target: 'offscreen', tabId: tabId});
        await saveTabLevel(tabId, 1);
        chrome.runtime.sendMessage({ type: 'popup-level', level: 100});
    }
}


/**
 * Change the mute state of all tabs
 * @param muted
 * @returns {Promise<void>}
 */
async function allTabMuteState(muted) {
    let queryOptions = {} // Get tabs across all chrome windows
    let tabs = await chrome.tabs.query(queryOptions);
        for (const tab of tabs){
            await chrome.tabs.update(tab.id, { muted: muted });
        }
}


/**
 * Toggles the mute state of the current tab
 * @returns {Promise<string>}
 */
async function toggleMuteState() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  let mute = !tab.mutedInfo.muted;
  await chrome.tabs.update(tab.id, { muted: mute });
  return mute.toString();
}


/**
 * Get the mute status of the current tab
 * @returns {Promise<string>}
 */
async function getTabMuteStatus() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  let muted = (tab.mutedInfo.muted).toString();
    return muted;
}


/**
 *
 * @param {string}
 *
 */
async function getCurrentTabTitleAndSound() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // Extract the first element in the array and store it in 'tab', discard the rest
  let [tab] = await chrome.tabs.query(queryOptions);
  let title = "No active tab found.";
	let audible = "False";
  let muted = false;
  // Get tab title
  if (tab) {
    console.log(` Title: ${tab.title}`);
    title = tab.title;
    // Get if the tab currently has audio playing
		if (tab.audible){
			audible = "True";
		}
    // Get if the tab is currently muted
    muted = tab.mutedInfo.muted;
  } else {
    console.log("No active tab found.");
  }
    return [title, audible, muted.toString()];
}


/**
 *
 *
 */
async function getAllTabTitlesAndSounds() {
  // ! fix
  let queryOptions = {}; // * Get tabs across all chrome windows
  let tabs = await chrome.tabs.query(queryOptions);
  let tabTitle = [], tabAudio = [], tabMuted = [];
  for (const tab of tabs) { 
    if (tab) {
      console.log(` !!Title: ${tab.title}`);
      tabTitle.push(tab.title);
      console.log(` !!Muted: ${tab.mutedInfo.muted}`);
      console.log(` !!Audible: ${tab.audible}`);
      tabMuted.push((tab.mutedInfo.muted).toString())
      if (tab.audible) {
        tabAudio.push("true");
        
      }
      else {
        tabAudio.push("false");
      }
    }
  }
  return [tabTitle, tabAudio, tabMuted];
}


/**
 *
 *
 */
async function getAllTabTitles() {
  let queryOptions = {}; // * Get tabs across all chrome windows
  let tabs = await chrome.tabs.query(queryOptions);
  let titles = []; 
  for (const tab of tabs) {
    if (tab) {
      titles.push(tab.title);
    }

  }
  return titles
}


/**
 *
 * @param {string}
 *
 */
async function removeTab(tabId){
    let items = await chrome.storage.local.get('levels');
    if(items.levels != null && items.levels[tabId] != null){
        delete items.levels[tabId];
        await chrome.storage.local.set({levels: items.levels});
    }
}


/**
 *
 * @param {string}
 *
 */
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


/**
 * Check if the tab exists in the activeStreams map
 * @param {string}
 *
 */
async function containsTab(tabId){
  let items = await chrome.storage.local.get('levels');
  let tabLevels = items.levels;
  return !(tabLevels == null || tabLevels[tabId] == null);

}


/**
 * Get the current tab's audio level
 * @param {string}
 *
 */
async function getTabLevel(tabId){
  let items = await chrome.storage.local.get('levels');
  let tabLevels = items.levels;
  
  // If level for current tab is not found, return 100
  if (!(await containsTab(tabId)) || tabLevels[tabId] < 0){
    return 100;
  }
  else{
    return tabLevels[tabId] * 100;
  }
}


/**
 * Creates an offscreen document if it doesn't exist
 * @param {string}
 *
 */
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
    }
}


/**
 * Adjust bass frequencies with lowshelf filter
 * @param {string}
 *
 */
async function lowshelf(tabId){
  console.log("[SERVICE-WORKER] Lowshelf function called");
  await createOffscreenDocument();
  let tabIdS = tabId.toString();

  if (await containsTab(tabIdS)){
    chrome.runtime.sendMessage({ type: 'lowshelf', target: 'offscreen', tabId: tabId});
  }
  else{
    const streamId = await chrome.tabCapture.getMediaStreamId({
      targetTabId: tabId
    });
    // Send the stream ID to the offscreen document to start recording
    chrome.runtime.sendMessage({ type: 'lowshelf-start', target: 'offscreen', data: streamId, tabId: tabId});
    await saveTabLevel(tabIdS, 1);

  }
}


/**
 * Adjust frequencies of highshelf filter
 * @param {string}
 *
 */
async function highshelf(tabId){
  await createOffscreenDocument();
  let tabIdS = tabId.toString();
  
  if (await containsTab(tabIdS)) {
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


/**
 *
 * @param {string}
 *
 */
async function updateTabVolume(tabId, volume){
  await createOffscreenDocument();
  let tabIdS = tabId.toString();
  let volumeS = volume.toString();
  // Tab already exits
  if(await containsTab(tabIdS)){
    chrome.runtime.sendMessage({ type: 'adjust-level', target: 'offscreen', tabId: tabId, level: volume});
    await saveTabLevel(tabIdS, volumeS);
  }
  // Tab doesn't exist
  else{
    // Get a MediaStream for the Active Tab
    const streamId = await chrome.tabCapture.getMediaStreamId({
      targetTabId: tabId
    });
    // Send the stream ID to the offscreen document to start recording
    chrome.runtime.sendMessage({ type: 'start-recording', target: 'offscreen', data: streamId, tabId: tabId, level: volume});
    await saveTabLevel(tabIdS, volumeS);
  }
  await getCurrentTabTitle();
}


/**
 *
 * @param {string}
 *
 */
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
