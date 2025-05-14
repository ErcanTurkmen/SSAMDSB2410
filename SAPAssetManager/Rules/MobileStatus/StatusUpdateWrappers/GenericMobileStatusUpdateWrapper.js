import libCom from '../../Common/Library/CommonLibrary';
import RunMobileStatusUpdateSequence from '../RunMobileStatusUpdateSequence';

export default function GenericMobileStatusUpdateWrapper(context) {
    //Save the binding object first since we are coming from a context menu swipe which does not allow us to get binding object from context.binding.
    const binding = libCom.setBindingObject(context);
    let eamOverallStatusConfigBinding = context.getActionResult('ReadResult').data.getItem(0);
    //Save the name of the page where user swipped the context menu from. It will be used later in common code that can be called from all kinds of different pages.
    libCom.setStateVariable(context, 'contextMenuSwipePage', libCom.getPageName(context));

    return RunMobileStatusUpdateSequence(context, binding, eamOverallStatusConfigBinding).finally(() => {
        cleanUp(context);
    });
}

function cleanUp(context) {
	libCom.removeBindingObject(context);
	libCom.removeStateVariable(context, 'contextMenuSwipePage');  
	delete context.getClientData().ChangeStatus;
}
