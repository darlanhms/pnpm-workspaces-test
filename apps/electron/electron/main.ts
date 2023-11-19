/* eslint-disable no-control-regex */
import 'dotenv/config';
import fs from 'fs/promises';

import { app, BrowserWindow, globalShortcut, ipcMain, shell } from 'electron';
import contextMenu from 'electron-context-menu';
import log from 'electron-log';

import forgeConfig from '../forge.config.js';

import { Logger } from './lib/logger';
import Updater from './lib/updater';

/**
 * @link https://www.electronforge.io/config/makers/squirrel.windows#my-app-is-launching-multiple-times-during-install
 */
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) app.quit();

log.info(`App starting in ${process.env.APP_ENV}...`);

contextMenu();

let mainWindow: BrowserWindow | null;

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const isDev = process.env.APP_ENV !== 'production';

const updater = new Updater();

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        backgroundColor: '#191622',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            spellcheck: true,
        },
        autoHideMenuBar: !isDev,
        title: forgeConfig.packagerConfig.name,
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.maximize();

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    updater.mainWindow = mainWindow;
    Logger.mainWindow = mainWindow;
}

async function registerListeners() {
    updater.registerListeners();

    /**
     * This comes from bridge integration, check bridge.ts
     */

    // Generals
    ipcMain.on('message', (_, message) => {
        console.info(message);
    });
    ipcMain.on('openExternalUrl', (_, url) => {
        shell.openExternal(url);
    });
    ipcMain.on('req-appVersion', event => {
        event.sender.send('res-appVersion', app.getVersion());
    });
    ipcMain.on('showUpdateDialog', () => {
        updater.showUpdateDialog();
    });
    ipcMain.on('req-logs', (event, lines: number) => {
        const logFilePath = log.transports.file.getFile().path;
        fs.readFile(logFilePath, { encoding: 'utf8' }).then(data => {
            const logsArray = data.split('\r\n').filter(Boolean);
            const start = lines > logsArray.length ? 0 : logsArray.length - lines;
            const restrictedLogs = logsArray.slice(start);
            event.sender.send('res-logs', restrictedLogs);
        });
    });
    ipcMain.on('log', (event, message: string, data?: any) => {
        Logger.sendToWindow(message, data);
    });
    globalShortcut.register('CommandOrControl+Shift+F9', () => {
        mainWindow?.webContents.openDevTools();
    });

    ipcMain.on('restartApplication', async () => {
        app.relaunch();
        app.quit();
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Create myWindow, load the rest of the app, etc...
app.on('ready', createWindow)
    .whenReady()
    .then(() => registerListeners())
    .catch(e => console.error(e));

app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});
