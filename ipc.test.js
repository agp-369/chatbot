const { ipcMain } = require('electron');
const { exec } = require('child_process');
require('./main.js'); // This will execute the main process's code, including the IPC handler

// Mock the child_process module
jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

describe('Windows Assistant Features', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute the correct command when opening an app', () => {
    // Simulate the renderer process sending the "open-app" event
    ipcMain.emit('open-app', {}, 'notepad');

    // Check that the exec function was called with the correct command
    expect(exec).toHaveBeenCalledWith('start notepad', expect.any(Function));
  });

  it('should handle different application names', () => {
    ipcMain.emit('open-app', {}, 'calc');
    expect(exec).toHaveBeenCalledWith('start calc', expect.any(Function));
  });
});