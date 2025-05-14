import WorkOrderOperationListViewSetCaption from './WorkOrderOperationListViewSetCaption';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import OperationMobileStatusLibrary from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import ResetQuickConfirmationFlags from '../../Confirmations/CreateUpdate/ResetQuickConfirmationFlags';
import IsIOS from '../../Common/IsIOS';

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
        return WorkOrderOperationListViewSetCaption(context);
    });
}
