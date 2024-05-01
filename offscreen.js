console.log("Offscreen is running");

let audioContext;
const gainNodes = new Map(); // Change the variable name to 'gainNodes'

chrome.runtime.onMessage.addListener((msg) => {
  if (!msg.offscreen) {
    return;
  }

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
});