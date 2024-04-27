console.log("popup.js loaded--");

/*
const app = Vue.createApp({
    data() {
        return {
            message: 'Hello, world!'
        };
    },
    render() {
        return Vue.h('h1', this.message);
    }
});

app.mount('#app');
*/

// Load the current volume for the tab
document.addEventListener('DOMContentLoaded', function () {
    var rangeInput = document.getElementById('volumeSlider');
    var rangeValue = document.getElementById('rangeValue');
    var messaging = chrome.runtime.sendMessage || browser.runtime.sendMessage;
    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Get the current volume for this tab
        var currentTab = tabs[0];
        var tabKey = String(currentTab.url); // Use the tab URL as the key
        chrome.storage.sync.get(tabKey, function (data) {
            var volume = data[tabKey];
            if (volume == undefined) {
                console.log('Volume not found, NEW TAB')
                volume = 100;
            }
            else{
                console.log('volume NOT undefined: ' + volume)
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
            console.log('saving slider: ' + volume)
            var querying = chrome.tabs.query || browser.tabs.query;
            chrome.storage.sync.set({ [tabKey]: this.value }); // Save the value with the tab URL as the key
            querying({ active: true, currentWindow: true }, function (tabs) {
                messaging({ command: "background", level: volume, tab: tabs[0].id }, function (response) {
    
                });
            });
        });
    });
});
