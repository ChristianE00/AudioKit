// Create the floating icon element
const floatingIcon = document.createElement('dev');
floatingIcon.id = 'floating-extension-icon';

// Create an image element for the icon
const iconImage = document.createElement('img');
iconImage.src = chrome.runtime.getURL('assets/icons/icon.png');
iconImage.style.width = '24px';
iconImage.style.height = '24px';
floatingIcon.appendChild(iconImage);


// Style the floating icon
floatingIcon.style.position = 'fixed';
floatingIcon.style.bottom = '20px';
floatingIcon.style.right = '20px';
floatingIcon.style.zIndex = '9999';
floatingIcon.style.cursor = 'pointer';
floatingIcon.style.padding = '10px';
floatingIcon.style.backgroundColor = '#ffffff';
floatingIcon.style.boarderRadius = '50%';
floatingIcon.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

// Add a click event listener
floatingIcon.addEventListener('click', function() {
    console.log('[CONTENT] Floating icon clicked');
    chrome.runtime.sendMessage({type: 'openPopup'});
});

// Add the floating icon to the page
document.body.appendChild(floatingIcon);





/*
console.log("content.js loaded");
var audioContext = null;
let elements = new Map(); // Map to store GainNode for each HTMLMediaElement
let players = new Map(); // Map to store Tone.Player for each HTMLMediaElement

function amplifyVolume(gainValue) {
    if (!audioContext) {
        console.log("Creating new audio context");
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const mediaElements = document.querySelectorAll('video, audio');
    mediaElements.forEach(element => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        let gainNode;
        if (elements.has(element)) {
            gainNode = elements.get(element);
        } else {
            gainNode = audioContext.createGain();
            const compressor = audioContext.createDynamicsCompressor();
            const source = audioContext.createMediaElementSource(element);
            source.connect(gainNode);
            // Apply dynamic range compression
            gainNode.connect(compressor);
            compressor.connect(audioContext.destination);
            elements.set(element, gainNode);
        }

        gainNode.gain.value = gainValue;
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.command == "volume") {
        const level = request.level * 0.01;
        console.log("content received volume command VOLUME: ", level);
        amplifyVolume(level);
    }
});

function handleNewAudioSource(event) {
    console.log("New audio source detected");
    // Get the current tab and get the volume if exists and call updateVolume
    chrome.runtime.sendMessage({ command: "getTabInfo" }, function (response) {
        let volume = response.volume !== undefined ? response.volume * 0.01 : 100 * 0.01;
        amplifyVolume(volume);
    });
}

function addPlayEventListener(element) {
    element.addEventListener('play', handleNewAudioSource);
}

// Handle existing audio and video elements
var mediaElements = document.querySelectorAll('audio, video');
mediaElements.forEach(addPlayEventListener);

// Create a MutationObserver to handle dynamically added audio and video elements
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === "childList") {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.nodeName.toLowerCase() === "audio" || node.nodeName.toLowerCase() === "video") {
                        addPlayEventListener(node);
                    }
                    // Check for audio and video elements inside the added node
                    const mediaElements = node.querySelectorAll('audio, video');
                    mediaElements.forEach(addPlayEventListener);
                }
            });
        }
    });
});

// Start observing
observer.observe(document.body, { childList: true, subtree: true });













function changeFavicon() {
    // Change favicon
    if (!activeIcon) {
        let link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = 'active.ico'; // Replace with the path to your icon
        link.href = chrome.runtime.getURL('active.ico'); // Replace with the path to your icon
        document.getElementsByTagName('head')[0].appendChild(link);
    }
}




sourceNodes = [];
varaudioContext = null;
var filter = null;
var gainNode = null;
*/


//adjustFrequency(440, 10);
/*
function adjustFrequency(frequency, dB) {

    if (!audioContext) {
        console.log("Creating new audio context");
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        filter = audioContext.createBiquadFilter();
        gainNode = audioContext.createGain();
    }

    // Create a BiquadFilterNode, which represents a second-order filter.
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = Math.sqrt(2);

    // Create a gain node to boost the frequency
    gainNode.gain.value = Math.pow(10, dB / 20); // Increase frequencyy by dB

    const mediaElements = document.querySelectorAll('video, audio');
    var sources = sourceNodes;
    var newMedia = false;
    if (sources.length == 0) {
        sources = mediaElements;
        newMedia = true;
    }

    sources.forEach(element => {
        var source = null;

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        if (newMedia) {

            source = audioContext.createMediaElementSource(element);
            sourceNodes.push(source);
        }
        else {
            source = element;
            if (source.mediaElement.networkState === source.mediaElement.NETWORK_NO_SOURCE) {
                const index = sourceNodes.indexOf(source);
                if (index > -1) {
                    sourceNodes.splice(index, 1);
                }
                source = audioContext.createMediaElementSource(element);
                sourceNodes.push(source);
            }
        }

        //connect the nodes
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        //play the sound
        audioElement.play();
    });
}
*/