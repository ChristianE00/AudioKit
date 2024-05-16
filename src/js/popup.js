
document.addEventListener('DOMContentLoaded', async () => {
    console.log("popup loaded");
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tabs[0].id;
    const url = tabs[0].url;
    let rangeValue = document.getElementById('rangeValue');
    let volumeSlider = document.getElementById('volumeSlider');
    let voiceBoost = document.getElementById('voiceBoost');
    let bassBoost = document.getElementById('bassBoost'); 
    let defaultButton = document.getElementById("defaultButton");
    // NOTE: DEPRICATED
    /*
    let bassVolumeSlider = document.getElementById('bassVolumeSlider');
    let midVolumeSlider = document.getElementById('midVolumeSlider');
    let bassRangeValue = document.getElementById('bassRangeValue');
    let midRangeValue = document.getElementById('midRangeValue');
    */

    // Currently for testing purposes
    voiceBoost.addEventListener('click', async () => {
      console.log("[POPUP] Voice Boost clicked");
      await chrome.runtime.sendMessage({ type: 'testSave'});
    });

    // Currently for testing purposes
    bassBoost.addEventListener('click', async () => {
      console.log("[POPUP] Bass Boost clicked");
      await chrome.runtime.sendMessage({ type: 'lowshelf-worker'});
    });

    // Clear storage for testing purposes
    defaultButton.addEventListener('click', async () => {
      console.log("[POPUP] Default Button clicked");
      await chrome.runtime.sendMessage({ type: 'clear-storage'});
    });

    // Set volume slider and range value to the current volume level
     chrome.runtime.onMessage.addListener( (msg) => {
      console.log("[POPUP] Message received from worker, type: ", msg.type);
      switch (msg.type) {
        case "popup-level":
          console.log("[POPUP] Popup loaded message received level: ", msg.level);
          const level = msg.level
          rangeValue.innerText = level;
          volumeSlider.value = level;
          break;
      }
    });

    // Let the service-worker know that the popup has loaded
    chrome.runtime.sendMessage({ type: 'popup-loaded', tabId: tabId });

    // Reset tab volume to 100%
    /*
    document.querySelector(".defaultButton").addEventListener("click", () => {
      updateVolume(1);
    });
    */

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

// NOTE: DEPRICATED
  /*
  bassVolumeSlider.addEventListener('input', async (event) => {
    bassRangeValue.innerText = event.target.value;
    const volume = event.target.value / 100;
    console.log("Slider MOVED value: ", volume);
    
    // Send the volume level to the service-worker
    await chrome.runtime.sendMessage({
      type: 'adjust-bass-level',
      level: volume,
    });
  });

  midVolumeSlider.addEventListener('input', async (event) => {
    midRangeValue.innerText = event.target.value;
    const volume = event.target.value / 100;
    console.log("Slider MOVED value: ", volume);
    
    // Send the volume level to the service-worker
    await chrome.runtime.sendMessage({
      type: 'adjust-mid-level',
      level: volume,
    });
  });
  */

  async function updateVolume(level) {
   await chrome.runtime.sendMessage({ type: "adjust-level", level: level });
  
  }
