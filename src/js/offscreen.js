// TODO: 5/15/24
// Get Audio-Enhancement inplemented

console.log("Offscreen is running");
let audioContext;
const gainNodes = new Map(); // Change the variable name to 'gainNodes'
const biquadFilters = new Map(); // Add a new map for biquad filters
const highShelfBiquadFilters = new Map(); // A map to store all highshelf biquad filter (voice enhancement)
const sources = new Map(); // A map to store all the sources

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
        const media = await createMediaSourceNode(msg.data);
        /*
        const media = await navigator.mediaDevices.getUserMedia({
          audio: {
            mandatory: {
              chromeMediaSource: "tab",
              chromeMediaSourceId: msg.data,
            },
          },
        });
        */

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
        // Save the source for default changes
        sources.set(msg.tabId, source);
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

    // NOTE: This isn't checking for the case of (gainNode) && !(biquadFilter)
    if (msg.type === 'lowshelf-start'){
      if (gainNodes.has(msg.tabId) && biquadFilters.has(msg.tabId)){
        console.log('[OFFSCREEN] ERROR found gain node in lowshelf-start ');
      }    
      else if(bigquadFilters.had(msg.tabId)){
        console.log('[OFFSCREEN-ERROR] Found biquad filter in lowshelf-start');
      }
      else{
        console.log('[OFFSCREEN] Creating new gain node in lowshelf-start');

        // creating a new gainNode
        const media = await createMediaSourceNode(msg.data);

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
        // Save the source for default changes
        sources.set(msg.tabId, source);

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

    if (msg.type === 'highshelf-start'){

      if (gainNodes.has(msg.tabId) && highShelfBiquadFilters.has(msg.tabId)){
        console.log('[OFFSCREEN] ERROR found gain node in highshelf-start ');
      }    
      else if(highShelfBiquadFilters.has(msg.tabId)){
        console.log('[OFFSCREEN-ERROR] found gain node in highshelf-start ');
      }
      else{
      
        console.log('[OFFSCREEN] Creating new gain node in lowshelf-start');
        console.log('[OFFSCREEN-highshelf] highshelf entered');

        // Create a new source
        const media = await createMediaSourceNode(msg.data); 
        
        // Continue to play the captured audio to the user
        const output = new AudioContext();
        const source = output.createMediaStreamSource(media);

        // Create gainNode
        const gainNode = output.createGain();
        //gainNode.gain.value = 0;
        const eq = output.createBiquadFilter();

        // Create a dyncamic compressor for compression
        const compressor = output.createDynamicsCompressor();
        compressor.threshold.value = -50; // dB level above which compressoin will start taking place
        compressor.knee.value = 40; // Value representing the range above the threshold where the curve smoothly transitions to the 'ratio' portion
        compressor.ratio.value = 12; // Amout of change (dB) need in the input for a 1 dB change in the output
        compressor.attack.value = 0; // The ammout of time, in seconds, required to reduce the gain by 10 dB
        compressor.release.value = 0.25; // The amout of time, in seconds, required to increase the gain by 10 dB

        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(eq);
        eq.connect(compressor);
        compressor.connect(output.destination);

        // Save the gain node & biquadFilter for future changes
        gainNodes.set(msg.tabId, gainNode);
        highShelfBiquadFilters.set(msg.tabId, eq);
        // Save the source for default changes
        sources.set(msg.tabId, source);

      }
    }
    if (msg.type === 'highshelf'){
        console.log('[OFFSCREEN-highshelf] highshelf entered');
        /*
      console.log('[OFFSCREEN-lowshelf] Found gain node');
        const biquadFilter = biquadFilters.get(msg.tabId);
        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 200;
        biquadFilter.gain.value = 6;
        */

        if(gainNodes.has(msg.tabId) && highShelfBiquadFilters.has(msg.tabId)){
            // Create a biquad filter for equalization
            const eq = highShelfBiquadFilters.get(msg.tabId);
            eq.type = "peaking";
            eq.frequency.value = 3000; // Center frequency of 3000 Hz
            eq.Q.value = 1; // Quality factor, determines the bandwidth of the frequencies affected
            eq.gain.value = 6; // Boost the cener frequency by 6 dB

            // Create a dyncamic compressor for compression
            const compressor = output.createDynamicsCompressor();
            compressor.threshold.value = -50; // dB level above which compressoin will start taking place
            compressor.knee.value = 40; // Value representing the range above the threshold where the curve smoothly transitions to the 'ratio' portion
            compressor.ratio.value = 12; // Amout of change (dB) need in the input for a 1 dB change in the output
            compressor.attack.value = 0; // The ammout of time, in seconds, required to reduce the gain by 10 dB
            compressor.release.value = 0.25; // The amout of time, in seconds, required to increase the gain by 10 dB
            // Don't need to connect eq, already connected

        }
    }
    if (msg.type === 'default'){
      console.log('OFFSCREEN] default entered');
      if(sources.has(msg.tabId)){
        console.log('[OFFSCREEN] Found gain node');
        const source = sources.get(msg.tabId);
        // Remove all filters
        if (gainNodes.has(msg.tabId)){
          const gainNode = gainNodes.get(msg.tabId);
          gainNode.disconnect();
          gainNodes.delete(msg.tabId);
        }
        if(biquadFilters.has(msg.tabId)){
          const biquadFilter = biquadFilters.get(msg.tabId);
          biquadFilter.disconnect();
          biquadFilters.delete(msg.tabId);
        }
        if(highShelfBiquadFilters.has(msg.tabId)){
          const eq = highShelfBiquadFilters.get(msg.tabId);
          eq.disconnect();
          highShelfBiquadFilters.delete(msg.tabId);
        }
        source.disconnect();
        sources.delete(msg.tabId); 
      }

    }

});


async function createMediaSourceNode(streamId){

  const media = await navigator.mediaDevices.getUserMedia({
            audio: {
              mandatory: {
                chromeMediaSource: "tab",
                chromeMediaSourceId: streamId,
              },
            },
          });

  return media;

}
