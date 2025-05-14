import Scanner from './Scanner';

export default class ZebraScanner extends Scanner {
    constructor() {
        super(ZebraScanner.INTENT_ACTION_SCAN, undefined);
    }

    static get INTENT_ACTION_SCAN() {
        return 'com.zebra.android.intent.action.SCAN';
    }

    static get DATA_STRING() {
        return 'com.symbol.datawedge.data_string';
    }

    static get LABEL_TYPE() {
        return 'com.symbol.datawedge.label_type';
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

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

    // eslint-disable-next-line no-unused-vars
    triggerScan(scanMode, selection) {
        // eslint-disable-next-line no-undef
        const intent = new android.content.Intent();
        intent.setAction('com.symbol.datawedge.api.ACTION');
        intent.putExtra('com.symbol.datawedge.api.SOFT_SCAN_TRIGGER', 'TOGGLE_SCANNING');
        this._appContext.sendBroadcast(intent);
    }

    isScannerAppInstalled() {
        return false;
    }

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
        const scanVal = intent.getStringExtra(ZebraScanner.DATA_STRING);
        const labelType = intent.getStringExtra(ZebraScanner.LABEL_TYPE);
        const data = [{ 'ScanValue': scanVal, 'ScanFormat': labelType }];
        context._onScanResult(data);
    }
}
