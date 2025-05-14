import libMeter from '../../Meter/Common/MeterLibrary';

export default function ReadingTransactionMdoHeader(context) {
    if (context.binding.ErrorObject) {
        for (let obj of context.binding.ErrorObject.CustomHeaders) {
            if (obj.Name === 'transaction.omdo_id') {
                return obj.Value;
            }
        }
        return context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/MeterReadingOmdoID.global').getValue();
    } else {
        let meterTransactionType = libMeter.getMeterTransactionType(context);
        if (meterTransactionType.startsWith('INSTALL') || meterTransactionType.startsWith('REMOVE') || meterTransactionType.startsWith('REPLACE') || meterTransactionType.startsWith('REP_INST')) {
            return context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/DeviceOmdoID.global').getValue();
        } else if (meterTransactionType.startsWith('PERIODIC')) {
            return context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/MeterReadingPeriodicOmdoID.global').getValue();
        }
        return context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/MeterReadingOmdoID.global').getValue();
    }
}
