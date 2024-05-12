console.log("Offscreen is running");
let audioContext;
const gainNodes = new Map(); // Change the variable name to 'gainNodes'
const biquadFilters = new Map(); // Add a new map for biquad filters

chrome.runtime.onMessage.addListener(async (msg) => {
  console.log("[OFFSCREEN] Message received from WORKER");
  if (msg.target !== 'offscreen' ) {
    console.log("[OFFSCREEN] Message is not from offscreen");
    return;
  }
  
  if (msg.type === 'start-recording'){
    console.log('[OFFSCREEN] Received start-recording message');

      if (gainNodes.has(msg.tabId)){
        console.log('[OFFSCREEN] ERROR found gain node ');
      }
      else {
        console.log('[OFFSCREEN] Creating new gain node');
        const media = await navigator.mediaDevices.getUserMedia({
          audio: {
            mandatory: {
              chromeMediaSource: "tab",
              chromeMediaSourceId: msg.data,
            },
          },
        });

        // Continue to play the captured audio to the user
        const output = new AudioContext();
        const source = output.createMediaStreamSource(media);
        //Lower volume by level
        const gainNode = output.createGain();
        gainNode.gain.value = msg.level;
        source.connect(gainNode);
        gainNode.connect(output.destination);
        // Save the gain node for future changes
        gainNodes.set(msg.tabId, gainNode);
      }
  } 

    if (msg.type === 'adjust-level'){
      
      if (gainNodes.has(msg.tabId)){
        console.log('found gain node');
        const gainNode = gainNodes.get(msg.tabId);
        gainNode.gain.value = msg.level;
      }
      else {
        console.log(" [ERROR] No gain node found");
      }
    }

    if (msg.type === 'lowshelf-start'){
      if (gainNodes.has(msg.tabId) && biquadFilters.has(msg.tabId)){
        console.log('[OFFSCREEN] ERROR found gain node in lowshelf-start ');
      }    
      else{
        console.log('[OFFSCREEN] Creating new gain node in lowshelf-start');

        // creating a new gainNode
        const media = await navigator.mediaDevices.getUserMedia({
          audio: {
            mandatory: {
              chromeMediaSource: "tab",
              chromeMediaSourceId: msg.data,
            },
          },
        });

        // Continue to play the captured audio to the user
        const output = new AudioContext();
        const source = output.createMediaStreamSource(media);

        // Create gainNode
        const gainNode = output.createGain();
        //gainNode.gain.value = 0;

        // Create a biquad filter
        const biquadFilter = output.createBiquadFilter();
        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 200; // Cutoff frequency of 200 Hz
        biquadFilter.gain.value = 6; // Boost frequencies below the cutoff by 6 dB

        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(biquadFilter);
        biquadFilter.connect(output.destination);

        // Save the gain node & biquadFilter for future changes
        gainNodes.set(msg.tabId, gainNode);
        biquadFilters.set(msg.tabId, biquadFilter);

      }
    
    }

    if (msg.type === 'lowshelf'){

      console.log('[OFFSCREEN-lowshelf] lowshelf entered');

      if(gainNodes.has(msg.tabId) && biquadFilters.has(msg.tabId)){
        console.log('[OFFSCREEN-lowshelf] Found gain node');
        const biquadFilter = biquadFilters.get(msg.tabId);
        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 200;
        biquadFilter.gain.value = 6;
      }
      else{
        console.log('[OFFSCREEN] lowshelf entered');
      }
    }

});
