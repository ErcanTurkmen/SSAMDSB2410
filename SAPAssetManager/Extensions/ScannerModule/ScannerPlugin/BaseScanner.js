export default class BaseScanner {
    constructor() {
        this._instance = null;
        this._appContext = null;
        this._mdkContext = null;
        this._isInited = false;
    }

    static get SCAN_RESULT_EVENT() {
        return 'ScanResultEvent';
    }

    static get HARD_KEY_PRESSED_EVENT() {
        return 'HardKeyPressedEvent';
    }

    // public
    // eslint-disable-next-line no-unused-vars
    init(mdkContext) {
        throw new Error('Abstract method init() must be implemented.');
    }

    cleanup() {
        throw new Error('Abstract method cleanup() must be implemented.');
    }

    // eslint-disable-next-line no-unused-vars
    triggerScan(scanMode, selection) {
        throw new Error('Abstract method triggerScan() must be implemented.');
    }

    isScannerAppInstalled() {
        throw new Error('Abstract method isScannerAppInstalled() must be implemented.');
    }

    // protected
    _init(mdkContext) {
        this._appContext = mdkContext?.currentPage?._context;
        this._mdkContext = mdkContext;
    }

    _onScanResult(data) {
        this.__getPageProxy()?.executeCustomEvent(BaseScanner.SCAN_RESULT_EVENT, data);
    }

    _onHardKeyPressed() {
        this.__getPageProxy()?.executeCustomEvent(BaseScanner.HARD_KEY_PRESSED_EVENT, undefined);
    }

    // private
    __getPageProxy() {
        return this._mdkContext?.evaluateTargetPathForAPI(`#Page:${this._mdkContext?.currentPage?.id}`);
    }
}
