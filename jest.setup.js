// Mock the chrome object
global.chrome = {
    runtime: {
      onMessage: {
        addListener: jest.fn(),
      },
      sendMessage: jest.fn(),
    },
    storage: {
      local: {
        get: jest.fn(),
        set: jest.fn(),
        clear: jest.fn(),
      },
    },
    tabs: {
      query: jest.fn(),
    },
    offscreen: {
      hasDocument: jest.fn(),
      createDocument: jest.fn(),
    },
    tabCapture: {
      getMediaStreamId: jest.fn(),
    },
  };