const { EventEmitter } = require('events');

const ipcMain = new EventEmitter();

module.exports = {
  ipcMain,
  // Mock other Electron modules as needed
  BrowserWindow: class {
    constructor() {}
    loadFile() {}
    on() {}
  },
  app: {
    whenReady: () => Promise.resolve(),
    on: jest.fn(),
    quit: jest.fn(),
  },
};