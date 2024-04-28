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

document.addEventListener('DOMContentLoaded', function () {
    var rangeInput = document.getElementById('volumeSlider');
    var rangeValue = document.getElementById('rangeValue');
    var messaging = chrome.runtime.sendMessage || browser.runtime.sendMessage;
    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Get the current volume for this tab
        var currentTab = tabs[0];
        var tabKey = String(currentTab.id); // Use the tab id as the key
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

        // Remove Element
        document.getElementById('signalRemoveElement').addEventListener('click', function() {
            document.getElementById('removeElement').remove()
            console.log('CLICK');
        });

        document.getElementById('defaultButton').addEventListener('click', function (){
            var volume = 100;
            var querying = chrome.tabs.query || browser.tabs.query;
            chrome.storage.sync.set({ [tabKey]: volume }); // Save the value with the tab id as the key
            document.getElementById('volumeSlider').value = 100;
            document.getElementById('rangeValue').innerText = 100;
            querying({ active: true, currentWindow: true }, function (tabs) {
                messaging({ command: "background", level: volume, tab: tabs[0].id }, function (response) {

                });
            });
            
        });

      // links
      var links =  document.getElementsByTagName('a');
      for (var i = 0; i < links.length; i++) {
        (function () {
          var ln = links[i];
          var location = ln.href;
          ln.onclick = function () {
            chrome.tabs.create({active: true, url: location});
          };
        })();
      }

       // Listen for changes to the slider
        document.getElementById('volumeSlider').addEventListener('change', function () {
            var volume = this.value;
            if (volume == undefined) {
                console.log('volume undefined');
                volume = 100;
            }
            console.log('saving slider: ' + volume)
            var querying = chrome.tabs.query || browser.tabs.query;
            chrome.storage.sync.set({ [tabKey]: this.value }); // Save the value with the tab id as the key
            querying({ active: true, currentWindow: true }, function (tabs) {
                messaging({ command: "background", level: volume, tab: tabs[0].id }, function (response) {
    
                });
            });
        });
    });
});



