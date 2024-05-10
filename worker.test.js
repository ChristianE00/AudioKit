const { worker, sum, getTabLevel } = require('./worker');

test('adds 1 + 2 to equal 3', () => {
  expect(worker(1, 2)).toBe(3);

});

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

describe('getTabLevel', () => {
  it('returns 100 if levels is null', async () => {
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: null });
    }); 

    const tabLevel = await getTabLevel('someTabId');
    expect(tabLevel).toBe(100);
  });

  it('returns the tab level times 100 if the tab level is found', async () => {
    const tabId = 'someTabId';
    const level = 2;
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: { [tabId]: level } });
    }); 

    const tabLevel = await getTabLevel(tabId);
    expect(tabLevel).toBe(level * 100);
  });
});