import libCommon from '../../Common/Library/CommonLibrary';
import validation from '../../Common/Library/ValidationLibrary';

export default class {

    static setMeterTransactionType(context, transactionType) {
        let local = false;
        let isuProcessType = '';
    
        if (transactionType && transactionType !== '') {
            isuProcessType = transactionType;
        } else {
            if (context.binding.ISUProcess) {
                isuProcessType = context.binding.ISUProcess;
            } else if (context.binding.OrderISULinks) {
                isuProcessType = this.getISUProcess(context.binding.OrderISULinks);
            } else if (context.binding.WOHeader?.OrderISULinks) {
                isuProcessType = this.getISUProcess(context.binding.WOHeader.OrderISULinks);
            } else if (context.binding.WorkOrderOperation?.WOHeader?.OrderISULinks) {
                isuProcessType = this.getISUProcess(context.binding.WorkOrderOperation.WOHeader.OrderISULinks);
            } else if (context.binding.DisconnectActivity_Nav?.WOHeader_Nav?.OrderISULinks) {
                isuProcessType = this.getISUProcess(context.binding.DisconnectActivity_Nav.WOHeader_Nav.OrderISULinks);
            }
            
            if (this.isLocal(context.binding)) {
                local = true;
            }
        }
        
        if (local) {
            libCommon.setStateVariable(context, 'TransactionType', isuProcessType + '_EDIT');  
        } else {
            libCommon.setStateVariable(context, 'TransactionType', isuProcessType);  
        }

    }

    static isProcessed(binding) {
        try {
            if ((binding.ISUProcess === 'REMOVE' || binding.ISUProcess === 'REPLACE') && (binding.Device_Nav.Equipment_Nav?.ObjectStatus_Nav?.SystemStatus_Nav?.SystemStatus === 'I0099' || (binding.Device_Nav.Equipment_Nav?.ObjectStatus_Nav?.SystemStatus_Nav?.SystemStatus === 'I0184' || binding.Device_Nav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.SystemStatus === 'LOC01'))) {
                return true;
            } else if ((binding.ISUProcess === 'INSTALL' || binding.ISUProcess === 'REP_INST') && binding.Device_Nav.Equipment_Nav?.ObjectStatus_Nav?.SystemStatus_Nav?.SystemStatus === 'I0100') {
                return true;
            } else if (binding.DisconnectActivity_Nav?.ActivityType === '01' && binding.Device_Nav.DeviceBlocked === true) {
                return true;
            } else if (binding.DisconnectActivity_Nav?.ActivityType === '03' && binding.Device_Nav.DeviceBlocked === false) {
                return true;
            } else {
                return false;
            }
        } catch (exc) {
            return false;
        }
    }

    static getMeterTransactionType(context) {
        return libCommon.getStateVariable(context, 'TransactionType');
    }

    static isOnEdit(context) {
        let tranType = this.getMeterTransactionType(context);
        return tranType.includes('EDIT');
    }

    static getISUProcess(orderISUArray) {
        for (let item of orderISUArray) {
            if (item.ISUProcess !== '') {
                return item.ISUProcess;
            }
        }
        return '';
    }

    static isLocal(binding) {
        if (!validation.evalIsEmpty(binding)) {
            if (binding instanceof Array) {
                for (let item of binding) {
                    if (Object.prototype.hasOwnProperty.call(item, '@sap.isLocal')) {
                        return true;
                    }
                }
            } else if (!validation.evalIsEmpty(binding.Device_Nav)) {
                return Object.prototype.hasOwnProperty.call(binding.Device_Nav,'@sap.isLocal');
            } else {
                Object.prototype.hasOwnProperty.call(binding,'@sap.isLocal');
            }
        }
        return false;   
    }

    static isReplace(isuProcessType) {
        return (isuProcessType === 'REPLACE' || isuProcessType === 'REP_INST' );
    }

    /**
     * set the meter reader true/false flag
     * @param {boolean} value 
     */
    static setMeterReaderFlag(value) {
        this._meterReaderFlag = value;
    }

    static getMeterReaderFlag() {
        return this._meterReaderFlag;
    }

    static getControlValueIfVisible(control) {
        if (control && control.getVisible() !== false) {
            return libCommon.getControlValue(control);
        }
        return '';
    }

    static isMeterObjectBinding(binding) {
        if (!binding) return false;

        const meterEntitySets = ['#sap_mobile.OrderISULink', '#sap_mobile.DisconnectionObject'];
        return meterEntitySets.includes(binding['@odata.type']);
    }

    static isDiscardMeterEnabled(context) {
        if (context.binding && this.isProcessed(context.binding)) {
            if (context.binding['@sap.isLocal']) {
                return Promise.resolve(true);
            } else {
                return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Device_Nav', [], '').then((result) => {
                    if (result?.length) {
                        return Boolean(result.getItem(0)['@sap.isLocal']);
                    } else {
                        return false;
                    }
                });
            }
        }
    
        return Promise.resolve(false);
    }
}
