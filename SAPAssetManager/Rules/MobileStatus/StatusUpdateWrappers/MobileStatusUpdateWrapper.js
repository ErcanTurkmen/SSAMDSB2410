import libCom from '../../Common/Library/CommonLibrary';
import { StatusTransitionTextsVar } from '../../Common/Library/GlobalStatusTransitionTexts';
import MobileStatusLibrary from '../MobileStatusLibrary';
import RunMobileStatusUpdateSequence, { getUpdateToStatusConfig } from '../RunMobileStatusUpdateSequence';

export default async function MobileStatusUpdateWrapper(context, transitionText) {
    //Save the binding object first since we are coming from a context menu swipe which does not allow us to get binding object from context.binding.
    const binding = libCom.setBindingObject(context);
    const objectType = MobileStatusLibrary.getMobileStatusNavLink(context, binding)?.OverallStatusCfg_Nav?.ObjectType;
    const mobileStatusForTextKey = StatusTransitionTextsVar.getStatusTransitionTexts(objectType)?.[transitionText];
    const updateToStatus = await getUpdateToStatusConfig(context, binding, mobileStatusForTextKey, objectType);

    if (updateToStatus) {
        //Save the name of the page where user swipped the context menu from. It will be used later in common code that can be called from all kinds of different pages.
        libCom.setStateVariable(context, 'contextMenuSwipePage', libCom.getPageName(context));

        return RunMobileStatusUpdateSequence(context, binding, updateToStatus).finally(() => {
            cleanUp(context);
        });
    }

    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
}

function cleanUp(context) {
	libCom.removeBindingObject(context);
	libCom.removeStateVariable(context, 'contextMenuSwipePage');  
	delete context.getClientData().ChangeStatus;
}
