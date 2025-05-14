import libCom from '../../Common/Library/CommonLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import operationsNav from '../../WorkOrders/Operations/OperationsListViewNav';
import subOperationsNav from '../../WorkOrders/SubOperations/SubOperationsListViewNav';

/**
 * Navigate to the correct list view after pressing Open KPI on new overview screen for maintenance technician
 * First set the state variable for the default filter to apply on the list page
 * @param {*} context 
 * @returns 
 */
export default function OpenListViewNav(context) {
    libCom.setStateVariable(context, 'KPI-Open', true);
    if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action');
    } else if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
        return operationsNav(context);
    } else if (MobileStatusLibrary.isSubOperationStatusChangeable(context)) {
        return subOperationsNav(context);
    }      
}
