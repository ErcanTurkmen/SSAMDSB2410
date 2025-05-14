import libCom from '../../Common/Library/CommonLibrary';
import libOpMobile from '../../Operations/MobileStatus/OperationMobileStatusLibrary';

/**
* This function reset OPERATIONS_FILTER state variable before navigation to Operations List
* @param {IClientAPI} context
*/
export default function OperationsListViewWithResetFiltersNav(context) {
    libCom.removeStateVariable(context, 'OPERATIONS_DATE_FILTER');
    libCom.setStateVariable(context, 'OPERATIONS_FILTER', '');
    return libOpMobile.isAnyOperationStarted(context).then(async () => {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action');
    });
}
