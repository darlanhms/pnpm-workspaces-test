import { contextBridge, ipcRenderer, PrinterInfo } from 'electron';

import DisplayConfig, { DisplayConfigConfig } from './lib/displayConfig';

// webFrame only exists in the renderer process
const displayConfig = new DisplayConfig();

export const api = {
    /**
     * Here you can expose functions to the renderer process
     * so they can interact with the main (electron) side
     * without security problems.
     *
     * The function below can accessed using `window.Main.sendMessage`
     */

    // Generals
    sendMessage: (message: string): void => {
        ipcRenderer.send('message', message);
    },
    openExternalUrl: (url: string): void => {
        ipcRenderer.send('openExternalUrl', url);
    },
    requestAppVersion: (): Promise<string> => {
        ipcRenderer.send('req-appVersion');
        return new Promise(resolve => {
            ipcRenderer.once('res-appVersion', (_, data) => resolve(data));
        });
    },
    showUpdateDialog: (): void => {
        ipcRenderer.send('showUpdateDialog');
    },
    requestLogs: (lines: number): Promise<Array<string>> => {
        ipcRenderer.send('req-logs', lines);
        return new Promise(resolve => {
            ipcRenderer.once('res-logs', (_, data) => resolve(data));
        });
    },
    log: (message: string, data?: unknown): void => {
        ipcRenderer.send('log', message, data);
    },
    logout: (): void => {
        ipcRenderer.send('logout');
    },
    // PrintConfig
    stopPrintListening: (): void => {
        ipcRenderer.send('stopPrintListening');
    },
    requestPrinters: (): Promise<Array<PrinterInfo>> => {
        ipcRenderer.send('req-printers');
        return new Promise(resolve => {
            ipcRenderer.once('res-printers', (_, data) => resolve(data));
        });
    },
    // DisplayConfig
    configureDisplayConfig: (config: DisplayConfigConfig): void => {
        displayConfig.configure(config);
    },

    /*: *
     * Provide an easier way to listen to events
     */
    on: <T = any>(channel: string, callback: (data: T) => void): void => {
        ipcRenderer.on(channel, (_, data) => callback(data));
    },
    removeListeners: (channel: string): void => {
        ipcRenderer.removeAllListeners(channel);
    },
    toggleLockInstance: (): void => {
        ipcRenderer.send('toggleLockInstance');
    },
    restartApplication: (): void => {
        ipcRenderer.send('restartApplication');
    },
};

contextBridge.exposeInMainWorld('Main', api);
