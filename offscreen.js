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
    const media = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: msg.data,
        },
      },
      video: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: msg.data,
        },
      },
    });

    // Continue to play the captured audio to the user
    const output = new AudioContext();
    const source = output.createMediaStreamSource(media);
    //Lower volume by 1/2
    const gainNode = output.createGain();
    gainNode.gain.value = 0.1;
    console.log("Audio lowered");
    source.connect(gainNode);
    gainNode.connect(output.destination);
  }

  /*
  switch (msg.type) {
    case "lower":
      console.log("Lowering the volume tabId: ", msg.tabId);
      if (!audioContext) {
        audioContext = new AudioContext();
      }
      if (!gainNodes.has(msg.tabId)) { // Use 'gainNodes' instead of 'gainNode'
        const gainNode = audioContext.createGain(); // Rename this variable to avoid shadowing
        gainNode.gain.value = 0.5;
        gainNode.connect(audioContext.destination);
        gainNodes.set(msg.tabId, gainNode); // Use 'gainNodes' instead of 'gainNode'
        console.log("Audio lowered");
      }
      break;
    case "pause":
      console.log("Pausing the audio");
      break;
  }
  */
});