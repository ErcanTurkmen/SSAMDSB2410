import libCom from '../Common/Library/CommonLibrary';
import WOMobileLib from './MobileStatus/WorkOrderMobileStatusLibrary';

export default function WorkOrdersListViewNav(context) {
    libCom.setStateVariable(context, 'WorkOrderListFilter', 'ALL_JOBS');
    libCom.setStateVariable(context, 'WORKORDER_FILTER', '$filter=');
    libCom.setStateVariable(context,'FromOperationsList', false);
    return WOMobileLib.isAnyWorkOrderStarted(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action');
    });
}
