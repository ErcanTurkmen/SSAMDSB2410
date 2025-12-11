import WorkOrderOperationListViewSetCaption from './WorkOrderOperationListViewSetCaption';
import CommonLibrary from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import OperationMobileStatusLibrary from '../../../../SAPAssetManager/Rules/Operations/MobileStatus/OperationMobileStatusLibrary';
import libPersona from '../../../../SAPAssetManager/Rules/Persona/PersonaLibrary';
import ResetQuickConfirmationFlags from '../../../../SAPAssetManager/Rules/Confirmations/CreateUpdate/ResetQuickConfirmationFlags';
import IsIOS from '../../../../SAPAssetManager/Rules/Common/IsIOS';

/**
* Handle OnReturning event
* @param {IClientAPI} context
*/
export default function WorkOrderOperationListViewOnReturning(context) {
    CommonLibrary.setStateVariable(context, 'OperationsToSelectCount', undefined);
    if (IsIOS(context)) {
        ResetQuickConfirmationFlags(context);
    }

    //isOperationsList means that list was opened from Overview/SideMenu
    //Set value FromOperationsList as true when returning to list from list item details
    let previousPage;
    let previousPageName;
    try {
        previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
        previousPageName = CommonLibrary.getPageName(previousPage);
    } catch (err) {
       // no previous page, navigated here from side menu
    }
    
    const overviewPageName = libPersona.getPersonaOverviewStateVariablePage(context);
    const isOperationsList = previousPageName ? previousPageName === overviewPageName : true;
    if (isOperationsList && !CommonLibrary.getStateVariable(context, 'FromOperationsList')) {
        CommonLibrary.setStateVariable(context,'FromOperationsList', true);
    }
    return OperationMobileStatusLibrary.isAnyOperationStarted(context).then(() => {
        context.getPageProxy()?.getControls()[0]?.sections[0]?.redraw(true);
        return WorkOrderOperationListViewSetCaption(context);
    });
}
