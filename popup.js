console.log("popup.js loaded--");



// Load the current volume for the tab
document.addEventListener('DOMContentLoaded', function () {
    var rangeInput = document.getElementById('volumeSlider');
    var rangeValue = document.getElementById('rangeValue');
    var messaging = chrome.runtime.sendMessage || browser.runtime.sendMessage;
    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Get the current volume for this tab
        var currentTab = tabs[0];
        chrome.storage.sync.get(String(currentTab.id), function (data) {
            var volume = data[currentTab.id];
            if (volume == undefined) {
                volume = 100;
            }
            rangeValue.innerText = volume;
            rangeInput.value = volume;
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
            var volume = this.value;
            if (volume == undefined) {
                console.log('volume undefined');
                volume = 100;
            }
            var querying = chrome.tabs.query || browser.tabs.query;
            chrome.storage.sync.set({ [String(currentTab.id)]: this.value });
            querying({ active: true, currentWindow: true }, function (tabs) {
                messaging({command: "background", level: volume, tab : tabs[0].id }, function (response) {

                });
            });
        });

    });


});

