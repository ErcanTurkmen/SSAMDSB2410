import Logger from '../../Log/Logger';
import libWOMobile from '../MobileStatus/WorkOrderMobileStatusLibrary';

export default function WorkOrdersHighPriorityListView(context) {
    Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'WorkOrdersListViewNav called');

    const actionBinding = {
        isHighPriorityList: true,
    };
    // Make this action binding distinct from a generic object
    // This is not an OData Binding
    // This function is intentionally left empty
    // Dummy return to avoid SonarQube warning
    actionBinding.constructor = function() {
        return null;
    };

    context.getPageProxy().setActionBinding(actionBinding);
    return libWOMobile.isAnyWorkOrderStarted(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action');
    });
}
