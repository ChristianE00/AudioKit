
async function combineIcons(icon1Url, icon2Url) {

    const icon1 = new Image();
    const icon2 = new Image();


    icon1.src = icon1Url;
    icon2.src = icon2Url;

    await Promise.all([
        new Promise(resolve => icon1.onload = resolve),
        new Promise(resolve => icon2.onload = resolve)
    ]);


    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');


    ctx.drawImage(icon1, 0, 0);
    ctx.drawImage(icon2, icon1.width, 0);


    const combinedIconUrl = canvas.toDataURL('image/x-icon');

    return combinedIconUrl;
}

var activeIcon = false;

function adjustVolume(percent) {
    activeIcon = true;
    const mediaElements = document.querySelectorAll('video, audio');
    mediaElements.forEach(element => {
        element.volume = percent;
    });

}


var audioContext = null;



let elements = new Map(); // Map to store GainNode for each HTMLMediaElement

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
        const level = request.level * .01;
        console.log("content received volume command VOLUME: ", level);
        /*if (level > 1) {
            amplifyVolume(level);
        }
        else {
            adjustVolume(level);
        }
        */
        amplifyVolume(level);
    }

});















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

//adjustFrequency(440, 10);
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
