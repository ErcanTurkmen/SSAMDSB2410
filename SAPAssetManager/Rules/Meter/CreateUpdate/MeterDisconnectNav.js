import libCommon from '../../Common/Library/CommonLibrary';
import libMeter from '../../Meter/Common/MeterLibrary';
import MeterSectionLibrary from '../Common/MeterSectionLibrary';

export default function MeterRemoveUpdateNav(context) {
    const replaceBinding = MeterSectionLibrary.getMeterReplaceBinding(context);
    libMeter.setMeterTransactionType(context, 'DISCONNECT');

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);
    if (replaceBinding) {
        context.setActionBinding(replaceBinding);
        context.getClientData().MeterDetailsUpdateDisabled = true;
    }
    return context.executeAction('/SAPAssetManager/Actions/Meters/MeterDisconnectNav.action');
}
