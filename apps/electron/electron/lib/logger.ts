import { BrowserWindow } from 'electron';
import log, { LogFunctions } from 'electron-log';

export class Logger {
    static mainWindow: BrowserWindow | null | undefined;

    static sendToWindow(title: string, data?: unknown, level: keyof LogFunctions = 'info'): void {
        let message = title;
        if (data) {
            let dataMessage = '';

            if (data instanceof Error) {
                dataMessage = data.message;
            } else {
                dataMessage = JSON.stringify(data, null, '\t');
            }

            message = `${title}: ${dataMessage}`;
        }

        log[level](message);

        if (level === 'error') {
            this.mainWindow?.webContents.send('errorLog', message);
        }

        this.mainWindow?.webContents.send('log', message);
    }
}
