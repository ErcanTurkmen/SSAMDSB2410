import libCom from '../../Common/Library/CommonLibrary';
import liibWOMobile from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';
import libOperationMobile from '../../Operations/MobileStatus/OperationMobileStatusLibrary';

export default function HoldMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('hold');

    return MobileStatusUpdateWrapper(context, transitionText).then(() => {
        return UpdateIsAnyObjectStartedFlag(context);
    });
}

function UpdateIsAnyObjectStartedFlag(context) {
    const binding = libCom.setBindingObject(context);

    if (binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue()) {
        libCom.removeStateVariable(context, 'isAnyOperationStarted');
        return libOperationMobile.isAnyOperationStarted(context);
    }
    
    libCom.removeStateVariable(context, 'isAnyWorkOrderStarted');
    return liibWOMobile.isAnyWorkOrderStarted(context);
}
