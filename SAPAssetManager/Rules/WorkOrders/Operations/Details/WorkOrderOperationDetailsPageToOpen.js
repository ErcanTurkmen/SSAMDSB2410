import PersonaLibrary from '../../../Persona/PersonaLibrary';
import { IsBindingObjectOnline } from '../../IsBindingObjectOnline';
import EDTSoftInputModeConfig from '../../../Extensions/EDT/EDTSoftInputModeConfig';

export default function WorkOrderOperationDetailsPageToOpen(context) {
    if (IsBindingObjectOnline(context)) {
        return '/SAPAssetManager/Pages/WorkOrders/Operations/OnlineWorkOrderOperationDetailsWithObjectCards.page';
    }
    if (isNewOperationDetailsToOpen(context)) {
        EDTSoftInputModeConfig(context);
        return '/SAPAssetManager/Pages/WorkOrders/Operations/WorkOrderOperationDetailsWithObjectCards.page';
    }
    return '/SAPAssetManager/Pages/WorkOrders/Operations/WorkOrderOperationDetails.page';
}

export function WorkOrderOperationDetailsPageNameToOpen(context) {
    if (IsBindingObjectOnline(context)) {
        return 'OnlineWorkOrderOperationDetailsWithObjectCards';
    }
    return isNewOperationDetailsToOpen(context) ? 'WorkOrderOperationDetailsWithObjectCards' : 'WorkOrderOperationDetailsPage';
}

function isNewOperationDetailsToOpen(context) {
    return !PersonaLibrary.isClassicHomeScreenEnabled(context) && (PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isFieldServiceTechnicianInCSMode(context) || PersonaLibrary.isWCMOperator(context));
}
