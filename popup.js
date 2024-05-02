



document.addEventListener('DOMContentLoaded', async () => {
    console.log("popup loaded");
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tabs[0].id;
    const url = tabs[0].url;
    

    let rangeValue = document.getElementById('rangeValue');
    let volumeSlider = document.getElementById('volumeSlider');

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
    document.querySelector(".defaultButton").addEventListener("click", () => {
      updateVolume(1);
    });

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


 /* 
  async function initAudioGainUI(tabId, url) {


  
    const audioData = await chrome.runtime.sendMessage({
      action: 'popupAudioDataGet',
      target: 'offscreen-document',
      tabId: tabId,
    });
  
    if (audioData) {
      const volume = audioData.gain.gain * 100;
      rangeValue.innerText = volume;
      volumeSlider.value = volume;
    } else {
      rangeValue.innerText = 100;
      volumeSlider.value = 100;
    }
  
  
  }
  
  async function initSliderEqualizerUI(tabId) {
    const equalizerPresets = document.querySelectorAll('.js-audio-equalizer__preset');
    const algorithmSelect = document.querySelector('.js-audio-equalizer__algorithm');
    const frequencySlider = document.querySelector('.js-audio-equalizer__frequency');
    const qSlider = document.querySelector('.js-audio-equalizer__q');
    const gainSlider = document.querySelector('.js-audio-equalizer__gain');
  
    const audioData = await chrome.runtime.sendMessage({
      action: 'popupAudioDataGet',
      target: 'offscreen-document',
      tabId: tabId,
    });
  
    if (audioData) {
      const { algorithm, frequency, q, gain } = audioData.equalizer;
      algorithmSelect.value = algorithm;
      frequencySlider.value = frequency;
      qSlider.value = q;
      gainSlider.value = gain;
    }
  
    /*
    algorithmSelect.addEventListener('change', async (event) => {
      await updateBiquadFilter(tabId, { algorithm: event.target.value });
    });
    */
    
  
    /*
    frequencySlider.addEventListener('input', async (event) => {
      await updateBiquadFilter(tabId, { frequency: event.target.value });
    });
  
    qSlider.addEventListener('input', async (event) => {
      await updateBiquadFilter(tabId, { q: event.target.value });
    });
  
    gainSlider.addEventListener('input', async (event) => {
      await updateBiquadFilter(tabId, { gain: event.target.value });
    });
    */
 /* 
    equalizerPresets.forEach((preset) => {
      preset.addEventListener('click', async () => {
        const presetType = preset.dataset.equalizerType;
        const { algorithm, frequency, q, gain } = EQUALIZER_PRESETS[presetType];
        await updateBiquadFilter(tabId, { algorithm, frequency, q, gain });
      });
    });
  }
  
  async function initActionResetUI(tabId) {
    const resetButton = document.querySelector('.js-actions__reset');
  
    const audioData = await chrome.runtime.sendMessage({
      action: 'popupAudioDataGet',
      target: 'offscreen-document',
      tabId: tabId,
    });

    document.querySelector(".pause").addEventListener("click", () => {
        chrome.runtime.sendMessage({type: "pause" });
    });
 */ 
    /*
    if (!audioData) {
      resetButton.classList.add('is-hidden');
    } else {
      resetButton.classList.remove('is-hidden');
      resetButton.addEventListener('click', async () => {
        await updateBiquadFilter(tabId, {
          algorithm: 'highpass',
          frequency: 0,
          q: 1,
          gain: 0,
        });
        await updateGain(tabId, 100);
      });
    }
    */
  /*
  }
  async function initActionRestoreUI(tabId, url) {
    const restoreButton = document.querySelector('.js-actions__restore');
    const restoreValue = document.querySelector('.js-actions__restore-value');
    const restoreDomain = document.querySelector('.js-actions__restore-domain');
  
    const audioData = await chrome.runtime.sendMessage({
      action: 'popupAudioDataGet',
      target: 'offscreen-document',
      tabId: tabId,
    });
  
    if (audioData) {
      restoreButton.classList.add('is-hidden');
    } else {
      const domainSettings = await getDomainSettings();
      const domain = new URL(url).hostname;
      const volume = domainSettings[domain]?.volume;
  
      if (volume !== undefined) {
        restoreButton.classList.remove('is-hidden');
        restoreValue.textContent = volume;
        restoreDomain.textContent = domain;
        restoreButton.addEventListener('click', async () => {
          await updateGain(tabId, volume);
        });
      }
    }
  }
  
  async function updateBiquadFilter(tabId, settings) {
    await chrome.runtime.sendMessage({
      action: 'popupBiquadFilterChange',
      target: 'service-worker',
      tabId: tabId,
      ...settings,
    });
  }
  
  async function updateGain(tabId, volumeValue) {
    await chrome.runtime.sendMessage({
      action: 'popupGainChange',
      target: 'service-worker',
      tabId: tabId,
      volumeValue: volumeValue,
    });
  }
  
  async function getDomainSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('domainSettings', (data) => {
        resolve(data.domainSettings || {});
      });
    });
  }
  
  const EQUALIZER_PRESETS = {
    default: { algorithm: 'highpass', frequency: 0, q: 1, gain: 0 },
    voice: { algorithm: 'peaking', frequency: 1500, q: 1, gain: 12 },
    bass: { algorithm: 'lowshelf', frequency: 350, q: 1, gain: 6 },
  };
*/
