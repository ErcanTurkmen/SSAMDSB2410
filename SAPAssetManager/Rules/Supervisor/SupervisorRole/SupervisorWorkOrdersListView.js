import Logger from '../../Log/Logger';
import libWOMobile from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function supervisorWorkOrdersListView(context) {
    Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'WorkOrdersListViewNav called');
    
    let actionBinding = {
        isSupervisorWorkOrdersList: true,
    };

    const REVIEW = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const DISAPPROVED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
    const APPROVED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue());
    CommonLibrary.setStateVariable(context, 'WORKORDER_FILTER', "$filter=(OrderMobileStatus_Nav/MobileStatus eq '" + REVIEW + "' or OrderMobileStatus_Nav/MobileStatus eq '" + DISAPPROVED + "' or OrderMobileStatus_Nav/MobileStatus eq '" + APPROVED + "')");

    context.getPageProxy().setActionBinding(actionBinding);
    return libWOMobile.isAnyWorkOrderStarted(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action');
    });
}

  
