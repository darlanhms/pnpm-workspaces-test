import { autoUpdater, BrowserWindow, dialog, app } from 'electron';

import { Logger } from './logger';

const TRINTA_MINUTOS = 60 * 1000 * 30;
const UM_MINUTO = 60 * 1000;

export default class Updater {
    mainWindow: BrowserWindow | null = null;

    needForcedUpdate(version: string): boolean {
        const [updateMajor, updateMinor] = version.split('.');
        const currentVersion = app.getVersion();
        const [currentMajor, currentMinor] = currentVersion.split('.');

        if (updateMajor > currentMajor) return true;

        if (updateMajor === currentMajor && updateMinor > currentMinor) return true;

        return false;
    }

    showUpdateDialog(newVersion?: string): void {
        const dialogOpts = {
            type: 'info',
            buttons: ['Atualizar', 'Agora não'],
            title: 'Atualização disponível',
            message: 'Uma nova versão do aplicativo está disponível. Você deseja atualizar agora?',
            detail: `A versão ${newVersion} será instalada`,
        };

        dialog.showMessageBox(dialogOpts).then(returnValue => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall();
        });
    }

    showForcedUpdateDialog(newVersion?: string): void {
        const dialogOpts = {
            type: 'info',
            buttons: ['Entendido'],
            title: 'Atualização obrigatória disponível',
            message:
                'Uma nova versão OBRIGATÓRIA do aplicativo está disponível. Em 1 minuto o aplicativo será reiniciado para a instalação.',
            detail: `A versão ${newVersion} será instalada`,
        };

        setInterval(() => {
            autoUpdater.quitAndInstall();
        }, UM_MINUTO);

        dialog.showMessageBox(dialogOpts);
    }

    registerListeners(): void {
        if (process.env.NODE_ENV !== 'production') return;

        autoUpdater.on('checking-for-update', () => {
            Logger.sendToWindow('Checking for update...');
        });

        autoUpdater.on('update-available', () => {
            Logger.sendToWindow('Update available');
            this.mainWindow?.webContents.send('updateStatus', 'update-available');
        });

        autoUpdater.on('update-not-available', () => {
            Logger.sendToWindow('Update not available');
        });

        autoUpdater.on('error', error => {
            Logger.sendToWindow('Error in auto-updater', error);
        });

        autoUpdater.on('update-downloaded', (_, releaseNotes, releaseName) => {
            Logger.sendToWindow('Update downloaded');
            this.mainWindow?.webContents.send('updateStatus', 'update-downloaded');
            const version = releaseName || releaseNotes;

            if (this.needForcedUpdate(version)) {
                this.showForcedUpdateDialog(version);
            } else {
                this.showUpdateDialog(version);
            }
        });

        const BUCKET_NAME =
            process.env.APP_ENV === 'production' ? process.env.BUCKET_NAME : process.env.BUCKET_NAME_STAGING;

        if (BUCKET_NAME) {
            const updateServerUrl = `http://${BUCKET_NAME}/latest`;

            Logger.sendToWindow('Update server url', updateServerUrl);

            autoUpdater.setFeedURL({
                url: updateServerUrl,
            });

            setInterval(() => {
                autoUpdater.checkForUpdates();
            }, TRINTA_MINUTOS);

            autoUpdater.checkForUpdates();
        }
    }
}
