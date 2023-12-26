// Listen for tab changes
/*chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.storage.sync.set({ [activeInfo.tabId]: 100 });
});

// Load the current volume for the tab
document.addEventListener('DOMContentLoaded', function () {
    var rangeInput = document.getElementById('volumeSlider');
    var rangeValue = document.getElementById('rangeValue');

    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Get the current volume for this tab
        var currentTab = tabs[0];
        chrome.storage.sync.get(String(currentTab.id), function (data) {
            var volume = data[currentTab.id];
            if (volume == undefined) {
                volume = 100;
            }
            else {
                updateVolume(volume);
            }
            rangeValue.innerText = volume;
            rangeInput.value     = volume;
        });
        // Listen for changes to the slider
        if (rangeInput && rangeValue) {
            rangeInput.addEventListener('input', function () {
                rangeValue.innerText = this.value;
                // Save the current value to storage whenever it changes
            });
        }
        else {
            console.error('Elements not found');
        }

        document.getElementById('volumeSlider').addEventListener('change', function () {
            chrome.storage.sync.set({ [String(currentTab.id)]: this.value });
            updateVolume(this.value);
        });

    });


});


function updateVolume(level) {
    console.log("Volume: " + level);
    var querying = chrome.tabs.query || browser.tabs.query;
    var messaging = chrome.tabs.sendMessage || browser.tabs.sendMessage;
    querying({ active: true, currentWindow: true }, function (tabs) {
        messaging(tabs[0].id, { command: "volume", level: level }, function (response) {
            console.log(response);
        });
    });
}
*/