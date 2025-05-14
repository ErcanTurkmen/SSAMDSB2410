import ApplicationSettings from './ApplicationSettings';

export default class NetworkMonitoringLibrary {
    constructor() {
        this._instance = null;
        this._callbackActions = {};
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    startNetworkMonitoring(context) {
        const connectivityModule = context.nativescript.connectivityModule;
        connectivityModule.startMonitoring((newConnectionType) => {
            switch (newConnectionType) {
                case connectivityModule.connectionType.wifi:
                case connectivityModule.connectionType.mobile:
                    // filter duplicated events
                    if (ApplicationSettings.getNumber(context, 'LastConnectionType') === connectivityModule.connectionType.none) {
                        for (let action of Object.values(this._callbackActions)) {
                            action();
                        }
                    }
                    break;
                default:
                    break;
            }
            // cache the last connetion type
            ApplicationSettings.setNumber(context, 'LastConnectionType', newConnectionType);
        });
    }

    stopNetworkMonitoring(context) {
        context.nativescript.connectivityModule.stopMonitoring();
    }
    
    addCallbackAction(key, action) {
        this._callbackActions[key] = action;
    }
    
    removeCallbackAction(key) {
        delete this._callbackActions[key];
    }

    /**
     * There are 6 possible connection types: 0 = none, 1 = wifi, 2 = mobile, 3 = ethernet, 4 = bluetooth, 5 = vpn
     * @param {*} context context object
     * @returns true if the network is connected, false otherwise
     */
    static isNetworkConnected(context) {
        const connectivityModule = context.nativescript.connectivityModule;
        //Network is not connected if connection type is none or bluetooth
        switch (connectivityModule.getConnectionType()) {
            case connectivityModule.connectionType.none:
            case connectivityModule.connectionType.bluetooth:
                return false;
            default:
                break;
        }        
        return true;
    }
}
