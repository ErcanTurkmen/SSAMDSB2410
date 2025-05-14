
import { GlobalVar as GlobalClass } from '../../Rules/Common/Library/GlobalCommon';
import Logger from '../../Rules/Log/Logger';
import knoxCaptureScanner from './ScannerPlugin/android/KnoxCaptureScanner';
import zebraScanner from './ScannerPlugin/android/ZebraScanner';

export default class ScannerLibrary {
    static get scannerType() {
        return this._scannerType;
    }

    static set scannerType(value) {
        this._scannerType = value;
    }

    static get SCAN_MODE_SINGLE_SCAN() {
        return 'Single scan';
    }

    static get SCAN_MODE_MULTI_SCAN() {
        return 'Multi scan';
    }

    static get SELECTION_AUTOMATIC() {
        return 'Automatic';
    }

    static get SELECTION_BATCH() {
        return 'Batch';
    }

    static get SELECTION_AIM_AND_SCAN() {
        return 'Aim and scan';
    }

    static get SELECTION_TAP_TO_SELECT() {
        return 'Tap to select';
    }

    static getInstance(context) {
        let instance = null;
        if (context.nativescript?.platformModule?.isAndroid) {
            switch (context.nativescript?.platformModule?.device?.manufacturer) {
                case 'samsung':
                    if (ScannerLibrary.scannerType === 'KNOX_CAPTURE') {
                        instance = knoxCaptureScanner.getInstance();
                    }
                    break;
                case 'Zebra Technologies':
                    if (ScannerLibrary.scannerType === 'ZEBRA') {
                        instance = zebraScanner.getInstance();
                    }
                    break;
                default:
                    break;
            }
        }
        return instance;
    }

    static init(context) {
        try {
            ScannerLibrary.scannerType = GlobalClass.getAppParam().THIRD_PARTY_SCANNER.SCANNERTYPE;
            const instance = this.getInstance(context);
            instance?.init(context);
        } catch (err) {
            Logger.error('ScannerLibrary', `init error: ${err}`);
        }
    }

    static cleanup(context) {
        const instance = this.getInstance(context);
        instance?.cleanup();
    }

    static triggerScan(context,
        scanMode = ScannerLibrary.SCAN_MODE_MULTI_SCAN,
        selection = ScannerLibrary.SELECTION_AUTOMATIC) {
        const instance = this.getInstance(context);
        instance?.triggerScan(scanMode, selection);
    }

    static isScannerAppInstalled(context) {
        const instance = this.getInstance(context);
        return instance ? instance.isScannerAppInstalled() : false;
    }
}
