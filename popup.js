console.log("popup.js loaded--");

function updateVolume(level) {
    console.log("Volume: " + level);
    var querying = chrome.tabs.query || browser.tabs.query;
    var messaging = chrome.tabs.sendMessage || browser.tabs.sendMessage;
    querying({active: true, currentWindow: true}, function(tabs) {
        messaging(tabs[0].id, {command: "volume", level: level}, function(response) {
            console.log(response);
        });
    });
}


document.getElementById('volumeSlider').addEventListener('change', function() {
    updateVolume(this.value);
});

