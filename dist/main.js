(()=>{var e={626:e=>{async function a(e,a){let t=await chrome.storage.local.get("levels"),o=null;null==t.levels?o={[e]:a}:(o=t.levels,o[e]=a),await chrome.storage.local.set({levels:o})}async function t(e){let a=(await chrome.storage.local.get("levels")).levels;return null!=a&&null!=a[e]&&(console.log("tablevels: "+a),!0)}async function o(e){let a=(await chrome.storage.local.get("levels")).levels;return!await t(e)||a[e]<0?(console.log("!!Level not found for tabId: ",e),100):(console.log("!!Level found for tabId: ",e),100*a[e])}async function s(){await chrome.offscreen.hasDocument()?console.log("Offscreen document already exists"):(console.log("Creating offscreen document"),await chrome.offscreen.createDocument({url:"offscreen.html",reasons:["USER_MEDIA"],justification:"Adjust tab audio volume"}),console.log("Created offscreen document"))}async function l(){let[e]=await chrome.tabs.query({active:!0,currentWindow:!0});return e}e.exports={worker:function(e,a){return e+a},sum:function(e,a){return e+a},getTabLevel:o,containsTab:t,getCurrentTab:l},chrome.runtime.onStartup.addListener((function(){console.log("Browser opened CLEARING CACHE"),chrome.storage.local.clear()})),new Map,chrome.runtime.onMessage.addListener((async e=>{switch(console.log("Message received from popup"),e.type){case"popup-loaded":let c=await l();var n=await o(c.id);console.log("[SERVICE-WORKER] Popup loaded message received sending level: ",n),chrome.runtime.sendMessage({type:"popup-level",level:n});break;case"adjust-level":console.log("[SERVICE-WORKER] Adjust level message received");var r=await l();await async function(e,o){await s();let l=e.toString(),n=o.toString();if(await t(l))console.log("[WORKER] tab found in activeStreams W/ tabId: ",e," volume: ",o),chrome.runtime.sendMessage({type:"adjust-level",target:"offscreen",tabId:e,level:o}),await a(l,n);else{console.log("[WORKER] tab not found in activeStreams W/ tabId: ",e," volume: ",o);const t=await chrome.tabCapture.getMediaStreamId({targetTabId:e});chrome.runtime.sendMessage({type:"start-recording",target:"offscreen",data:t,tabId:e,level:o}),await a(l,n)}console.log("BEFORE"),await async function(){let[e]=await chrome.tabs.query({active:!0,lastFocusedWindow:!0});e?console.log(` Title: ${e.title}`):console.log("No active tab found.")}(),console.log("AFTER")}(r.id,e.level);break;case"testSave":console.log("[SERVICE-WORKER] Test save message received"),r=await l(),await testSave(r.id);break;case"testGet":console.log("[SERVICE-WORKER] Test get message received"),r=await l(),await testGet(r.id);break;case"clear-storage":console.log("[SERVICE-WORKER] Clear storage message received"),await chrome.storage.local.clear();break;case"lowshelf-worker":console.log("[SERVICE-WORKER] Lowshelf message received"),r=await l(),await async function(e){console.log("[SERVICE-WORKER] Lowshelf function called"),await s();let o=e.toString();if(await t(o))chrome.runtime.sendMessage({type:"lowshelf",target:"offscreen",tabId:e});else{console.log("[SERVICE-WORKER] tab not found in activeStreams W/ tabId: ",e);const t=await chrome.tabCapture.getMediaStreamId({targetTabId:e});chrome.runtime.sendMessage({type:"lowshelf-start",target:"offscreen",data:t,tabId:e}),await a(o,1)}}(r.id);break;case"highshelf-worker":console.log("[SERVICE-WORKER] Highshelf message received"),r=await l(),await async function(e){console.log("[SERVICE-WORKER] Highshelf function called"),await s();let o=e.toString();if(await t(o))chrome.runtime.sendMessage({type:"highshelf",target:"offscreen",tabId:e});else{console.log("[SERVICE-WORKER] tab not found in activeStreams W/ tabId: ",e);const t=await chrome.tabCapture.getMediaStreamId({targetTabId:e});chrome.runtime.sendMessage({type:"highshelf-start",target:"offscreen",data:t,tabId:e}),await a(o,1)}}(r.id);break;case"default-worker":console.log("[SERVICE-WORKER] Default message received"),r=await l(),await async function(e){await t(e)&&(chrome.runtime.sendMessage({type:"default",target:"offscreen",tabId:e}),await a(e,1),chrome.runtime.sendMessage({type:"popup-level",level:100}))}(r.id)}}))}},a={};!function t(o){var s=a[o];if(void 0!==s)return s.exports;var l=a[o]={exports:{}};return e[o](l,l.exports,t),l.exports}(626)})();