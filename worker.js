
console.log("Worker is running");

/*
chrome.tabs.onUpdated.addListener(handleTabUpdate);

async function handleTabUpdate(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    console.log("Tab is Updated");


    // Check if the offscreen document already exists
    if (await chrome.offscreen.hasDocument()) {
    }
    else{
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Adjust tab audio volume'
      });
      console.log("Created offscreen document");
    }

    // Send the tabId to the offscreen document
    await chrome.runtime.sendMessage({ type: "lower", offscreen: true, tabId: tabId});
    console.log("Sent message to offscreen document");
  }
  else {
    console.log("Tab is not updated");
  }
}
*/



// Messages from the popup
chrome.runtime.onMessage.addListener(async (msg) => {
  console.log("Message received from popup");
  switch (msg.type) {
    case "play":
      console.log("Play message received");
      currTab = await getCurrentTab();
      console.log("Current tab is: ", currTab.id);
      await updateTabVolume(currTab.id, 0.5);
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
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Adjust tab audio volume'
      });
      console.log("Created offscreen document");
    }

    // Send the tabId to the offscreen document
    await chrome.runtime.sendMessage({ type: "lower", offscreen: true, tabId: tabId});
    console.log("Sent message to offscreen document");
}


async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}


/*
function createOffscreenDocument(tabId) {
  const options = {
    url: 'offscreen.html',
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'Adjust tab audio volume'

  };

  chrome.offscreen.createDocument(options)
    .then(sendTabIdToOffscreenDocument)
    .catch(handleOffscreenDocumentError);

  function sendTabIdToOffscreenDocument(document) {
    document.postMessage({ tabId: tabId });
  }

  function handleOffscreenDocumentError(error) {
    console.error('Error creating offscreen document:', error);
  }
}
*/
