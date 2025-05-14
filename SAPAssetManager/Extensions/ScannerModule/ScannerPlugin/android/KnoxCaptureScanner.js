
import Scanner from './Scanner';

export default class KnoxCaptureScanner extends Scanner {
    constructor() {
        super(KnoxCaptureScanner.INTENT_ACTION_SCAN, KnoxCaptureScanner.INTENT_ACTION_HARD_KEY);
    }

    static get KNOX_CAPTURE_PACKAGE() {
        return 'com.samsung.android.app.smartscan';
    }

    static get INTENT_ACTION_SCAN() {
        return 'com.samsung.knoxcapture.intent.action.RECEIVER';
    }

    static get INTENT_ACTION_HARD_KEY() {
        return 'com.samsung.android.knox.intent.action.HARD_KEY_REPORT';
    }

    static get INTENT_API_ACTION() {
        return 'com.samsung.android.knox.intent.api.ACTION';
    }

    static get INTENT_API_TRIGGER_ACTION() {
        return 'com.samsung.android.knox.intent.api.TRIGGER_ACTION';
    }

    static get SCANNED_BUNDLE_LIST() {
        return 'com.samsung.smartscan.scanned_bundle_list';
    }

    static get SYMBLOGY_TYPE() {
        return 'com.samsung.smartscan.symblogy_type';
    }

    static get UNPROCESSED_STRING_DATA() {
        return 'com.samsung.smartscan.unprocessed_string_data';
    }

    static get HARD_KEY_REPORT_TYPE() {
        return 'com.samsung.android.knox.intent.extra.KEY_REPORT_TYPE';
    }

    static get SCAN_MODE() {
        return 'scanner_mode';
    }

    static get BARCODE_SELECTION() {
        return 'barcode_selection';
    }

    static get PENDING_INTENT() {
        return 'pending_intent';
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    // public
    init(mdkContext) {
        if (!this._isInited) {
            this._init(mdkContext);
            this._registerReceiver();
            this._isInited = true;
        }
    }

    cleanup() {
        if (this._isInited) {
            this._unregisterReceiver();
            this._isInited = false;
        }
    }

    triggerScan(scanMode, selection) {
        // eslint-disable-next-line no-undef
        const intent = new android.content.Intent();
        intent.setPackage(KnoxCaptureScanner.KNOX_CAPTURE_PACKAGE);
        intent.setAction(KnoxCaptureScanner.INTENT_API_ACTION);

        intent.putExtra(KnoxCaptureScanner.INTENT_API_TRIGGER_ACTION, 'START');
        intent.putExtra(KnoxCaptureScanner.SCAN_MODE, scanMode);
        intent.putExtra(KnoxCaptureScanner.BARCODE_SELECTION, selection);

        // eslint-disable-next-line no-undef
        const pendingIntent = android.app.PendingIntent.getBroadcast(this._appContext, 0, this._appContext.getIntent(), android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE);
        intent.putExtra(KnoxCaptureScanner.PENDING_INTENT, pendingIntent);

        this._appContext.sendBroadcast(intent);
    }

    isScannerAppInstalled() {
        try {
            // eslint-disable-next-line no-undef
            this._appContext?.getPackageManager().getPackageInfo(KnoxCaptureScanner.KNOX_CAPTURE_PACKAGE, android.content.pm.PackageManager.GET_ACTIVITIES);
            return true;
        } catch (ex) {
            console.log('isScannerAppInstalled Exception: ', ex);
            return false;
        }
    }

    // protected
    _registerReceiver() {
        // eslint-disable-next-line no-undef
        const callbackImpl = android.content.BroadcastReceiver.extend({
            // eslint-disable-next-line no-unused-vars
            onReceive: (context, intent) => {
                this.__receiverCallBack(intent, this);
            },
        });
        super._registerReceiver(new callbackImpl());
    }

    // private
    __receiverCallBack(intent, context) {
        switch (intent.getAction()) {
            case KnoxCaptureScanner.INTENT_ACTION_SCAN: {
                const scannedBundleList = intent.getParcelableArrayListExtra(KnoxCaptureScanner.SCANNED_BUNDLE_LIST);
                const data = [];
                for (let i = 0; i < scannedBundleList.size(); i++) {
                    data.push({
                        'ScanFormat':
                            scannedBundleList.get(i).getString(KnoxCaptureScanner.SYMBLOGY_TYPE),
                        'ScanValue':
                            context.__stringJoin(scannedBundleList.get(i).getStringArrayList(KnoxCaptureScanner.UNPROCESSED_STRING_DATA), ','),
                    });
                }
                context._onScanResult(data);
                break;
            }
            case KnoxCaptureScanner.INTENT_ACTION_HARD_KEY: {
                const extras = intent.getExtras();
                const keyReportType = extras?.getInt(KnoxCaptureScanner.HARD_KEY_REPORT_TYPE);
                if (keyReportType && keyReportType === 2) {
                    context._onHardKeyPressed();
                }
                break;
            }
            default:
                break;
        }
    }

    __stringJoin(strings, splitter) {
        let result = '';
        for (let i = 0; i < strings.size(); i++) {
            if (i > 0) {
                result += splitter;
            }
            result += strings.get(i);
        }
        return result;
    }
}
