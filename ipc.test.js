const { ipcMain } = require('electron');
const { exec } = require('child_process');
require('./main.js'); // This will execute the main process's code, including the IPC handler

// Mock the child_process module
jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

describe('Offline System Control', () => {
  // Mock the platform to be win32 for these tests
  const originalPlatform = process.platform;
  beforeAll(() => {
    Object.defineProperty(process, 'platform', { value: 'win32' });
  });

  afterAll(() => {
    Object.defineProperty(process, 'platform', { value: originalPlatform });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute the correct command when opening an app', () => {
    ipcMain.emit('open-app', {}, 'notepad');
    expect(exec).toHaveBeenCalledWith('start notepad', expect.any(Function));
  });

  it('should execute the correct command for volume control', () => {
    ipcMain.emit('set-volume', {}, 50);
    expect(exec).toHaveBeenCalledWith('sndvol.exe', expect.any(Function));
  });

  it('should execute the correct command for opening system settings', () => {
    ipcMain.emit('open-settings', {}, 'display');
    expect(exec).toHaveBeenCalledWith('start ms-settings:display', expect.any(Function));
  });
});