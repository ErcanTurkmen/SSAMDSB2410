import libCom from '../Common/Library/CommonLibrary';
import NoteCreateNav from '../Notes/NoteCreateNav';
import mobileStatusUpdateOverride from './MobileStatusUpdateOverride';

export default function OperationRejectCreateRejectReasonNav(context) {
    libCom.setStateVariable(context, 'IsOnRejectOperation', true);
    const actionBinding = context.getPageProxy().getActionBinding();
    return NoteCreateNav(context, actionBinding).then(() => {
        let statusElement = libCom.getStateVariable(context, 'RejectStatusElement');
        return context.executeAction(mobileStatusUpdateOverride(context, statusElement, 'OperationMobileStatus_Nav',
            '/SAPAssetManager/Rules/MobileStatus/OperationMobileStatusPostUpdate.js', actionBinding));
    }).finally(() => {
        libCom.removeStateVariable(context, 'RejectStatusElement');
        libCom.removeStateVariable(context, 'IsOnRejectOperation');
        libCom.removeStateVariable(context, 'IsOnRejectOperationBinding');
    });
}
