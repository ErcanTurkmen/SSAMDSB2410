import libCICO from '../../ClockInClockOut/ClockInClockOutLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function StartMobileStatusUpdateWrapper(context) {
    const transitionText = libCICO.isCICOEnabled(context) ?
        context.localizeText('clock_in') :
        context.localizeText('start');

    return MobileStatusUpdateWrapper(context, transitionText).then(() => {
        UpdateIsAnyObjectStartedFlag(context);
    });
}

function UpdateIsAnyObjectStartedFlag(context) {
    const binding = libCom.setBindingObject(context);

    if (binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue()) {
        libCom.setStateVariable(context, 'isAnyOperationStarted', true);
    }
    
    libCom.setStateVariable(context, 'isAnyWorkOrderStarted', true);
}
