
adjustVolume(0.5);
function adjustVolume(percent){
    const mediaElements = document.querySelectorAll('video, audio');
    mediaElements.forEach(element => {
        element.volume = percent;
    });
}

sourceNodes = [];
var audioContext = null;
var filter = null;
var gainNode = null;

adjustFrequency(440, 10);
function adjustFrequency(frequency, dB){
	
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
    if(sources.length == 0){
        sources = mediaElements;
        newMedia = true;
    }

    sources.forEach(element => {
        var source = null;
        if(newMedia){
            source = audioContext.createMediaElementSource(element);
            sourceNodes.push(source);
        }
        else{
            source = element;
        }

		//connect the nodes
		source.connect(filter);
		filter.connect(gainNode);
		gainNode.connect(audioContext.destination);

		//play the sound
		audioElement.play();
    });
}
