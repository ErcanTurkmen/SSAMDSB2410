import BaseScanner from '../BaseScanner';

export default class Scanner extends BaseScanner {
    constructor(scanReceiver, hardKeyReceiver) {
        super();
        this._broadcastReceiver = null;
        // eslint-disable-next-line no-undef
        this._intentFilter = new android.content.IntentFilter();
        if (scanReceiver) {
            this._intentFilter.addAction(scanReceiver);
        }
        if (hardKeyReceiver) {
            this._intentFilter.addAction(hardKeyReceiver);
        }
    }

    // protected
    _registerReceiver(broadcastReceiver) {
        if (broadcastReceiver && this._intentFilter) { 
            try {
                // eslint-disable-next-line no-undef
                if (android.os.Build.VERSION.SDK_INT >= 34) {
                    // eslint-disable-next-line no-undef
                    this._appContext?.registerReceiver(broadcastReceiver, this._intentFilter, android.content.Context.RECEIVER_EXPORTED);
                } else {
                    this._appContext?.registerReceiver(broadcastReceiver, this._intentFilter);
                }
                this._broadcastReceiver = broadcastReceiver;
            } catch (e) {
                e.printStackTrace();
            }
        }
    }

    _unregisterReceiver() {
        if (this._broadcastReceiver) {
            try {
                this._appContext?.unregisterReceiver(this._broadcastReceiver);
            } catch (e) {
                e.printStackTrace();
            }
        }
    }
}
