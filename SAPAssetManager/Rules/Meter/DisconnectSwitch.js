import CommonLibrary from '../Common/Library/CommonLibrary';
import libMeter from '../Meter/Common/MeterLibrary';
import MeterSectionLibrary from './Common/MeterSectionLibrary';

export default function DisconnectSwitch(context) {
    if (libMeter.getMeterTransactionType(context) === MeterSectionLibrary.getMeterISOConstants(context).DISCONNECT) {
        return validateSingleMeterData(context).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Meters/DisconnectMeterChangeSet.action');
        });
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Meters/ReconnectMeterChangeSet.action');
    }
}

function validateSingleMeterData(context) {  
    const statusControl = CommonLibrary.getControlProxy(context, 'TypeLstPkr');
    const status = CommonLibrary.getControlValue(statusControl);
    if (status) {
        statusControl.clearValidation();
    } else {
        const message = context.localizeText('field_is_required');
        CommonLibrary.executeInlineControlError(context, statusControl, message);
        return Promise.reject();
    }
        
    return Promise.resolve();
}
