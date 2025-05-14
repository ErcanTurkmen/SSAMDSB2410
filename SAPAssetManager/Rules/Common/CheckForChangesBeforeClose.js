import libCom from './Library/CommonLibrary';
import libCrew from '../Crew/CrewLibrary';
import ClearFlagsAndClose from '../Crew/ClearFlagsAndClose';
import GetCloseOrCancelAction from './GetCloseOrCancelAction';
/**
* Check for unsaved changes before closing or canceling a page
* @param {IClientAPI} context
*/
export default function CheckForChangesBeforeClose(context) { 
    const confirmCrewCancelAction = '/SAPAssetManager/Actions/Crew/ConfirmCancel.action';
    const unsavedChanges = libCom.unsavedChangesPresent(context);
    const finalAction = GetCloseOrCancelAction(context, unsavedChanges);
    const isCrewFeatureEnabled = libCrew.isCrewFeatureEnabled(context);

    if (unsavedChanges) {
        let action = isCrewFeatureEnabled ? confirmCrewCancelAction : finalAction;
        return context.executeAction(action);
    } else if (isCrewFeatureEnabled) {
        return ClearFlagsAndClose(context);
    } else {
        // proceed with cancel without asking
        return context.executeAction(finalAction);
    }
}
