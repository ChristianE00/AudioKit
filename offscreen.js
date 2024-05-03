console.log("Offscreen is running");
let audioContext;
const gainNodes = new Map(); // Change the variable name to 'gainNodes'

chrome.runtime.onMessage.addListener(async (msg) => {
  console.log("Message received from WORKER");
  if (msg.target !== 'offscreen' ) {
    console.log("Message is not from offscreen");
    return;
  }
  
  if (msg.type === 'start-recording'){
    console.log('Received start-recording message');

      if (gainNodes.has(msg.tabId)){
        console.log('[ERROR] found gain node ');
      }
      else {
        console.log('Creating new gain node');
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

});