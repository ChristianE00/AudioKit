
function sendAllTabsMuteStatus(muted) {
    if (muted) {
        chrome.runtime.sendMessage({ type: 'mute-all' });
    }
    else {
        chrome.runtime.sendMessage({ type: 'unmute-all' });
    }
}
let hideSuggestions = false;

// Wait for zhe DOM to load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Popup loaded');
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
    let tabMuteAllIcon = document.getElementById("tabMuteAllIcon");
    let tabMutedAllButton = document.getElementById("signalToggleMuteAllButton");
    let tabUnmuteAllIcon = document.getElementById("tabUnmuteAllIcon");
    let tabUnmutedAllButton = document.getElementById("signalToggleUnmuteAllButton");
    let tabList = document.getElementById("tabList");

    // Update UI to list the 4 tabs that are currently playing audio
   function updateUITabList(tabs) {
    let length = (tabs.length > 4) ? 4 : tabs.length;
    if (length === 0)  {
        tabList.hidden = true;
        return;
    }
    tabList.hidden = false;
    for (let i = 0; i < length; i++) {
        let el = document.createElement('p');
        el.textContent = tabs[i];
        tabList.append(el);
    }

   }



    // Sender
    function sendMessagePromise(message) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, response => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });
    }

    async function getDataFromReceiver() {
        try {
            const response = await sendMessagePromise({type: "get-tab"});
            console.log("Received response:", response);
            if (response && response.data) {
                processData(response.data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function getTabDataFromReceiver() {
        try {
            const response = await sendMessagePromise({type: "get-tabs"});
            console.log("Received response:", response);
            if (response && response.data) {
                processData(response.data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function processTabsData(tabs){
      for (let tab of tabs) {
        console.log("!!Tab: ", tab);
      }
    }

    function processData(data) {
        console.log("Processing data tabid: ", data);
        return data
    }

    

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    let tab = tabs[0];
    let tabId = tab.id;
    const url = tab.url;




    chrome.storage.local.get(['hideSuggestions'], function(result) {
      hideSuggestions = result.hideSuggestions || false;

      if (hideSuggestions) {
        document.getElementById('suggestionBox').style.display = 'none';
      }
    });

    suggestionCloseButton.addEventListener('click', function() {
      hideSuggestions = true;
      document.getElementById('suggestionBox').style.display = 'none';

      // save volue to chrome.storage.local
      chrome.storage.local.set({ hideSuggestions: hideSuggestions }, function() {
        console.log('Value is set to ' + hideSuggestions);
      });
      
    });

    // - Mute All
    tabMutedAllButton.addEventListener('click', function() {
      sendAllTabsMuteStatus(true);
    });

    // - Unmute All
    tabUnmutedAllButton.addEventListener('click', function() {
      sendAllTabsMuteStatus(false);
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
          const title = truncateString(msg.title, 60);
          const audible = msg.audible;
          muted = msg.muted;
          currentTabTitle.innerText = ` ${title} `;
          const allTabs = msg.allTabs;
          updateUITabList(allTabs);

          // ! Move into a function
          updateTabMuteStatus(muted);

          if (audible === "True"){
            audibleEntry.style.color = "green";
          }
          else {
            audibleEntry.style.color = "red";
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
      if (muted === "true"){
        tabMuteIcon.className = 'fa-solid fa-volume-xmark ';
        tabMuted.style.color = "green";
        
        // NOTE: Get this working in the future
        //tabMuted.classList.contains('text-red-500') ? tabMuted.classList.remove('text-red-500') : null;
        //tabMuted.classList.add('text-green-500');
      }
      else {
        tabMuteIcon.className = 'fa-solid fa-volume-high';
        // NOTE: Get this working in the future
        //tabMuted.classList.contains('text-green-500') ? tabMuted.classList.remove('text-green-500') : null;
        //tabMuted.classList.add('text-red-500');
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

