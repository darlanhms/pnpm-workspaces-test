import { webFrame } from 'electron';

export interface DisplayConfigConfig {
    zoomFactor: number;
}

export default class DisplayConfig {
    private set zoomFactor(newZoomFactor: number) {
        webFrame.setZoomFactor(newZoomFactor);
    }

    configure(config: DisplayConfigConfig): void {
        this.zoomFactor = config.zoomFactor || 1;
    }
}
