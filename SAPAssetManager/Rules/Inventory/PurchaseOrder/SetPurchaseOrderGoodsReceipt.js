import libCom from '../../Common/Library/CommonLibrary';
import wrapper from '../IssueOrReceipt/IssueOrReceiptCreateUpdateNavWrapper';
import receipt from '../StockTransportOrder/SetSTOGoodsReceipt';
import issue from '../StockTransportOrder/SetSTOIssue';
import allowIssue from '../StockTransportOrder/AllowIssueForSTO';
import EditPurchaseRequisitionNav from '../PurchaseRequisition/EditPurchaseRequisitionNav';
import PurchaseRequisitionLibrary from '../PurchaseRequisition/PurchaseRequisitionLibrary';

export default function SetPurchaseOrderGoodsReceipt(context, customBinding) {
    let binding = customBinding || context.binding || context.getPageProxy().getActionBinding();
    let type = binding['@odata.type'].substring('#sap_mobile.'.length);
    let pageName = libCom.getCurrentPageName(context);
    if (type === 'StockTransportOrderItem' || type === 'StockTransportOrderHeader') {
        return processStockTransportOrderType(binding, context);
    } else if (type === 'PurchaseOrderItem' || type === 'PurchaseOrderHeader') {
        libCom.setStateVariable(context, 'IMObjectType', 'PO'); //PO/STO/RES/IN/OUT/ADHOC/PRD
        libCom.setStateVariable(context, 'IMMovementType', 'R'); //I/R
        return wrapper(context);
    } else if (type === 'ReservationItem' || type === 'ReservationHeader') {
        libCom.setStateVariable(context, 'IMObjectType', 'RES');
        libCom.setStateVariable(context, 'IMMovementType', 'I');
        return wrapper(context);
    } else if (
        (type === 'ProductionOrderHeader' && pageName === 'ProductionOrderComponentsListPage') ||
        type === 'ProductionOrderComponent'
    ) {
        libCom.setStateVariable(context, 'IMObjectType', 'PRD');
        libCom.setStateVariable(context, 'IMMovementType', 'I');
        return wrapper(context);
    } else if (
        (type === 'ProductionOrderHeader' && pageName === 'ProductionOrderItemsListPage') ||
        type === 'ProductionOrderItem'
    ) {
        libCom.setStateVariable(context, 'IMObjectType', 'PRD');
        libCom.setStateVariable(context, 'IMMovementType', 'R');
        return wrapper(context);
    } else if (type === 'PurchaseRequisitionHeader' || type === 'PurchaseRequisitionItem') {
        return getPurchaseRequisitionNav(binding, context);
    }
}

function getPurchaseRequisitionNav(binding, context) {
    const isLocal = libCom.isCurrentReadLinkLocal(binding['@odata.readLink']);
    if (isLocal) {
        PurchaseRequisitionLibrary.setDetailsPageFlag(context, true);
        return EditPurchaseRequisitionNav(context);
    }
    return false;
}

function processStockTransportOrderType(binding, context) {
    if (allowIssue(binding)) {
        return issue(context); //Supplying plant matches user's default plant, so do an issue
    }
    return receipt(context);
}
