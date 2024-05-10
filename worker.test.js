const { worker, sum, getTabLevel, containsTab, getCurrentTab } = require('./worker');

// Example test
test('adds 1 + 2 to equal 3', () => {
  expect(worker(1, 2)).toBe(3);

});

// Example test
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

// getTabLevel tests
describe('getTabLevel', () => {
  it('[TABID = NULL] returns 100 if levels is null', async () => {
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: null });
    }); 

    const tabLevel = await getTabLevel('someTabId');
    expect(tabLevel).toBe(100);
  });
  
  it('[LEVEL = 2]returns the tab level times 100 if the tab level is found', async () => {
    const tabId = 'someTabId';
    const level = 2;
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: { [tabId]: level } });
    }); 

    const tabLevel = await getTabLevel(tabId);
    expect(tabLevel).toBe(level * 100);
  });

  it('[LEVEL = 0] Returns the tab level if the tab level is found', async () => {
    const tabId = 'myTabId';
    const level = 0;
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: { [tabId]: level } });
    });

    const tabLevel = await getTabLevel(tabId);
    expect(tabLevel).toBe(level * 100);
  });


  it('[LEVEL = -1] Should default to 100 if level < 0', async () => {
    const tabId = 'myTabId';
    const level = -1;
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: { [tabId]: level } });
    });

    const tabLevel = await getTabLevel(tabId);
    expect(tabLevel).toBe(100);
  });

});

// containsTab tests
describe('containsTab', () => {
  
  it('[LEVELS = NULL] Returns if the tabId exists', async() => {
    const tabId = 'myTabId';
    const level = 0;
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: null });
    }); 

    const tabExists = await containsTab(tabId);
    expect(tabExists).toBe(false);
  });

  it('[TABID = NULL] Returns if the tabId exists', async() => {
    const tabId = 'myTabId';
    const level = 0;
    const notMyTabId = 'notMyTabId';
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: {[notMyTabId] : level } });
    }); 

    const tabExists = await containsTab(tabId);
    expect(tabExists).toBe(false);
  });

  it('[TABID = myTabId] Returns if the tabId exists', async() => {
    const tabId = 'myTabId';
    const level = 0;
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: {[tabId] : level } });
    }); 

    const tabExists = await containsTab(tabId);
    expect(tabExists).toBe(true);
  });

});


// getCurrentTab tests
describe('getCurrentTab', () => {
  // test 1
  it('should return the current tab', async () => {
    const mockTab = { id: 1, url: 'http://exmaple.com' };
    chrome.tabs.query.mockResolvedValue([mockTab]); 
    const tab = await getCurrentTab();
    expect(chrome.tabs.query).toHaveBeenCalledWith({ active: true, currentWindow: true});
    expect(tab).toEqual(mockTab);
  });

  // test 2
  it('should return the current tab', async () => {
    const mockTab = { id: 1, url: 'https://christianewing.com' };
    chrome.tabs.query.mockResolvedValue([mockTab]); 
    const tab = await getCurrentTab();
    expect(chrome.tabs.query).toHaveBeenCalledWith({ active: true, currentWindow: true});
    expect(tab).toEqual(mockTab);
  });
  
});

describe('defaultButton', () => {
  it('[DEFAULT BUTTON]should send a message when clicked', async () => {
    // Create a button and attach the event listener to it
    const defaultButton = document.createElement('button');
    defaultButton.addEventListener('click', async () => {
      console.log("[POPUP] Default Button clicked");
      await chrome.runtime.sendMessage({ type: 'clear-storage'});
    });

    // Simulate a click event
    defaultButton.click();

    // Since the event listener is async, we need to wait for the next event loop
    // before our assertions to ensure the promise has resolved
    await new Promise(resolve => setTimeout(resolve, 0));

    // Verify that sendMessage was called with the correct arguments
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({ type: 'clear-storage' });
  });

});


describe('bassBoost', () => {
  it('[BASS BOOST BUTTON] should send a message when clicked', async() => {
    const bassBoost = document.createElement('button');
    bassBoost.addEventListener('click', async () => {
      console.log("[POPUP] Bass Boost clicked");
      await chrome.runtime.sendMessage({ type: 'testGet' });
    });

    bassBoost.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({ type: 'testGet' });
  });
});

describe('voiceBoost', () => {
  it('[VOICE BOOST BUTTON] should send a message when clicked', async() => {
    const voiceBoost = document.createElement('button');
    voiceBoost.addEventListener('click', async () => {
      console.log("[POPUP] Voice Boost clicked");
      await chrome.runtime.sendMessage({ type: 'testSave' });
    });

    voiceBoost.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({ type: 'testSave' });
  });
});