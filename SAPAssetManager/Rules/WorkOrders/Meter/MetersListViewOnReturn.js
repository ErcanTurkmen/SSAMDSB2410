import libMeter from '../../Meter/Common/MeterLibrary';
import MeterSectionLibrary from '../../Meter/Common/MeterSectionLibrary';

export default function MetersListViewOnReturn(context) {
    let action = '/SAPAssetManager/Actions/Meters/ClosePageReconnect.action';
    context.evaluateTargetPathForAPI('#Page:-Previous').setActionBarItemVisible(0, false);
    
    const woBinding = MeterSectionLibrary.getWorkOrderBinding(context);
    const isuLinks = woBinding?.OrderISULinks || [];
    if (libMeter.getISUProcess(isuLinks) === 'DISCONNECT') {
        action = '/SAPAssetManager/Actions/Meters/ClosePageDisconnect.action';
    }

    return context.executeAction(action);
}
