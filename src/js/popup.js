
let hideSuggestions = false;
document.addEventListener('DOMContentLoaded', async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tabs[0].id;
    const url = tabs[0].url;
    let rangeValue = document.getElementById('rangeValue');
    let volumeSlider = document.getElementById('volumeSlider');
    let voiceBoost = document.getElementById('voiceBoost');
    let bassBoost = document.getElementById('bassBoost'); 
    let defaultButton = document.getElementById("defaultButton");
    let suggestionCloseButton = document.getElementById("signalRemoveElement");
    let currentTabTitle = document.getElementById("currentTabTitle");
    let audibleEntry = document.getElementById("isAudible");
    let tabMuteIcon = document.getElementById("tabMuteIcon");
    let tabMuted = document.getElementById("tabMuted");
    let tabMutedToggleButton = document.getElementById("signalToggleMuteButton"); 

    chrome.storage.local.get(['hideSuggestions'], function(result) {
      hideSuggestions = result.hideSuggestions || false;

      if (hideSuggestions) {
        document.getElementById('suggestionBox').style.display = 'none';
      }
    });

    suggestionCloseButton.addEventListener('click', function() {
      // document.getElementById('suggestionBoxWrapper').style.display = 'none';
      hideSuggestions = true;
      document.getElementById('suggestionBox').style.display = 'none';

      // save volue to chrome.storage.local
      chrome.storage.local.set({ hideSuggestions: hideSuggestions }, function() {
        console.log('Value is set to ' + hideSuggestions);
      });
      
    });

    voiceBoost.addEventListener('click', async () => {
      await chrome.runtime.sendMessage({ type: 'highshelf-worker'});
    });

    bassBoost.addEventListener('click', async () => {
      await chrome.runtime.sendMessage({ type: 'lowshelf-worker'});
    });

    // Clear storage for testing purposes
    defaultButton.addEventListener('click', async () => {
      await chrome.runtime.sendMessage({ type: 'default-worker'});
    });

    // Set volume slider and range value to the current volume level
    
     chrome.runtime.onMessage.addListener( (msg) => {
      let muted = false;
      switch (msg.type) {
        case "popup-level":
          const level = msg.level;
          const title = truncateString(msg.title, 30);
          const audible = msg.audible;
          muted = msg.muted;
          currentTabTitle.innerText = `Tab: ${title} `;

          // ! Move into a function
          updateTabMuteStatus(muted);

          if (audible == "True"){
            audibleEntry.style.color = "green";
            //audibleEntry.innerText = "-- Audible";
          }
          else {
            audibleEntry.style.color = "red";
            //audibleEntry.innerText = "-- Not Audible";
          }
          rangeValue.innerText = level;
          volumeSlider.value = level;
          break;

        case "tab-muted":
          muted = msg.muted;
          updateTabMuteStatus(muted);
      }
    });


    function updateTabMuteStatus(muted) {
      if (muted == "true"){
        tabMuteIcon.className = 'fa-solid fa-volume-xmark';
        tabMuted.style.color = "green";
      }
      else {
        tabMuteIcon.className = 'fa-solid fa-volume-high';
        tabMuted.style.color = "red"; 
      }
    }

    function truncateString(str, maxLength) {
      if (str.length > maxLength) {
          return str.slice(0, maxLength) + '...';
      }
      return str;
    }

    tabMutedToggleButton.addEventListener('click', async () => {
      console.log("tabMutedToggleButton clicked");
      await chrome.runtime.sendMessage({ type: 'toggle-mute' });

    });

    // Let the service-worker know that the popup has loaded
    chrome.runtime.sendMessage({ type: 'popup-loaded', tabId: tabId });

    volumeSlider.addEventListener('input', async (event) => {
      rangeValue.innerText = event.target.value;
      const volume = event.target.value / 100;
      console.log("Slider MOVED value: ", volume);
      
      // Send the volume level to the service-worker
      await chrome.runtime.sendMessage({
        type: 'adjust-level',
        level: volume,
      });
    });
  });

  async function updateVolume(level) {
   await chrome.runtime.sendMessage({ type: "adjust-level", level: level });
  
  }

