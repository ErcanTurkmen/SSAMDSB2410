import comLib from '../../Common/Library/CommonLibrary';
import BulkGoodsIssueIsAllowed from '../IssueOrReceipt/BulkUpdate/BulkGoodsIssueIsAllowed';
import BulkGoodsReceiptIsAllowed from '../IssueOrReceipt/BulkUpdate/BulkGoodsReceiptIsAllowed';
import BulkMatDocReverseIsAllowed from '../IssueOrReceipt/BulkUpdate/BulkMatDocReverseIsAllowed';
import ReverseAllWrapper from '../IssueOrReceipt/BulkUpdate/ReverseAllWrapper';
import InboundOrOutboundDeliveryIssueAllReceiveAll from './InboundOrOutboundDeliveryIssueAllReceiveAll';

export default function NavigateToObjectUpdate(context) {
    const pageProxy = context.getPageProxy();
    const actionContext = pageProxy.getActionBinding();  
    
    if (actionContext?.PhysicalInventoryDocHeader_Nav) {
        return navigateToPhysicalInventoryCountAll(context, pageProxy, actionContext);
    } else if (actionContext?.InboundDelivery_Nav) {
        return InboundOrOutboundDeliveryIssueAllReceiveAll(context, actionContext.InboundDelivery_Nav);
    } else if (actionContext?.OutboundDelivery_Nav) {
        return InboundOrOutboundDeliveryIssueAllReceiveAll(context, actionContext.OutboundDelivery_Nav);
    } else if (actionContext?.ReservationHeader_Nav) {
        return navigateToReservationIssueAll(context, pageProxy, actionContext);
    } else if (actionContext?.PurchaseOrderHeader_Nav) {
        return navigateToPurchaseOrderReceiveAll(context, pageProxy, actionContext);
    } else if (actionContext?.StockTransportOrderHeader_Nav) {
        return navigateToStockTransportOrderIssueAll(context, pageProxy, actionContext);
    } else if (actionContext?.ProductionOrderHeader_Nav) {
        return navigateToProductionOrderIssueAll(context, pageProxy, actionContext);
    } else if (actionContext?.PurchaseRequisitionHeader_Nav) {
        return navigateToPurchaseRequisitionDetails(pageProxy, actionContext);
    } else if ((actionContext?.MaterialDocument_Nav) || (pageProxy?.binding?.MaterialDocNumber)) {
        return navigateToMaterialDocCreate(context,pageProxy, actionContext);
    }
}

function navigateToPhysicalInventoryCountAll(context, pageProxy, actionContext) {
    comLib.setStateVariable(context, 'BulkUpdateItem', 0);
    comLib.setStateVariable(context, 'PIHeaderReadlink', actionContext.PhysicalInventoryDocHeader_Nav['@odata.readLink']);
    comLib.setStateVariable(context, 'PIHeader', actionContext.PhysicalInventoryDocHeader_Nav);
    return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Rules/Inventory/PhysicalInventory/PhysicalInventoryCountAllNav.js', actionContext.PhysicalInventoryDocHeader_Nav['@odata.readLink'], '$expand=PhysicalInventoryDocItem_Nav');
}

function navigateToPurchaseRequisitionDetails(pageProxy, actionContext) {
    return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/PurchaseRequisition/PurchaseRequisitionDetailsNav.action', actionContext.PurchaseRequisitionHeader_Nav['@odata.readLink'], '$expand=PurchaseRequisitionLongText_Nav,PurchaseRequisitionItem_Nav/PurchaseRequisitionLongText_Nav');
}

function navigateToReservationIssueAll(context, pageProxy, actionContext) {
    return BulkGoodsIssueIsAllowed(context, actionContext.ReservationHeader_Nav).then((allowed) => {
        if (allowed) {
            comLib.setStateVariable(context, 'IMObjectType', 'RES');
            comLib.setStateVariable(context, 'IMMovementType', 'I');
            return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOrReceiptGenericFieldsCreateNav.action', actionContext.ReservationHeader_Nav['@odata.readLink'], '$expand=MyInventoryObject_Nav');
        }
        return undefined;
    });
}


function navigateToPurchaseOrderReceiveAll(context, pageProxy, actionContext) {
    return BulkGoodsReceiptIsAllowed(context, actionContext.PurchaseOrderHeader_Nav).then((allowed) => {
        if (allowed) {
            comLib.setStateVariable(context, 'IMObjectType', 'PO');
            comLib.setStateVariable(context, 'IMMovementType', 'R');
            return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOrReceiptGenericFieldsCreateNav.action', actionContext.PurchaseOrderHeader_Nav['@odata.readLink'],
            '$expand=MyInventoryObject_Nav,PurchaseOrderHeaderLongText_Nav,Vendor_Nav');
        }
        return undefined;
    });
}

function navigateToStockTransportOrderIssueAll(context, pageProxy, actionContext) {
    return BulkGoodsIssueIsAllowed(context, actionContext.StockTransportOrderHeader_Nav).then((allowed) => {
        if (allowed) {
            comLib.setStateVariable(context, 'IMObjectType', 'STO');
            comLib.setStateVariable(context, 'IMMovementType', 'I');
            return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOrReceiptGenericFieldsCreateNav.action', actionContext.StockTransportOrderHeader_Nav['@odata.readLink'], '$expand=MyInventoryObject_Nav');
        }
        return undefined;
    });
}

function navigateToProductionOrderIssueAll(context, pageProxy, actionContext) {
    return BulkGoodsIssueIsAllowed(context, actionContext.ProductionOrderHeader_Nav).then((allowed) => {
        if (allowed) {
            comLib.setStateVariable(context, 'IMObjectType', 'PRD');
            comLib.setStateVariable(context, 'IMMovementType', 'I');
            return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOrReceiptGenericFieldsCreateNav.action', actionContext.ProductionOrderHeader_Nav['@odata.readLink'], '$expand=ProductionOrderItem_Nav/Material_Nav');
        }
        return undefined;
    });
}

function navigateToMaterialDocCreate(context, pageProxy, actionContext) {
    return BulkMatDocReverseIsAllowed(context, pageProxy, actionContext).then((allowed) => {
        if (allowed) {
           return ReverseAllWrapper(context);
        }
        return false;
    });
}
