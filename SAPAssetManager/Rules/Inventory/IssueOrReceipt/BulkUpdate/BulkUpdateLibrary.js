import { MovementTypes, SpecialStock, AccountAssignments } from '../../Common/Library/InventoryLibrary';

export const HeaderToItemsEntitySetName = {
    'PurchaseOrderHeader'       : 'PurchaseOrderItems',
    'ReservationHeader'         : 'ReservationItems',
    'StockTransportOrderHeader' : 'StockTransportOrderItems',
    'ProductionOrderHeader'     : 'ProductionOrderComponents',
    'MaterialDocument'          : 'MaterialDocItems',
};

export const StorageLocationNotVisible = {
    MovementType   : [MovementTypes.t103, MovementTypes.t107],
    SpecialStockInd: [SpecialStock.PipelineStock],
};

export const WBSElementVisible = {
    MovementType     : [MovementTypes.t221],
    SpecialStockInd  : [SpecialStock.ProjectStock],
    AccountAssignment: [AccountAssignments.Project],
};

export const CostCenterVisible = {
    MovementType     : [MovementTypes.t201, MovementTypes.t261],
    AccountAssignment: [AccountAssignments.CostCenter, AccountAssignments.Order],
};

export const OrderVisible = {
    MovementType: [MovementTypes.t261],
    AccountAssignment: [AccountAssignments.Order],
};

export const NetworkVisible = {
    MovementType: [MovementTypes.t281],
    AccountAssignment: [AccountAssignments.Network],
};

export const VendorVisible = {
    SpecialStockInd: [SpecialStock.ConsignmentVendor, SpecialStock.PipelineStock],
};

export const GLAccountVisible = {
    MovementType     : [MovementTypes.t201, MovementTypes.t221, MovementTypes.t261, MovementTypes.t281],
    AccountAssignment: [AccountAssignments.CostCenter, AccountAssignments.Network, AccountAssignments.Order, AccountAssignments.Project],
};

export function GetOpenItemsQuery(type) {
    let query;
    switch (type) {
        case 'PurchaseOrderItems':
            query = '((OpenQuantity gt 0) and (FinalDeliveryFlag ne \'X\' and DeliveryCompletedFlag ne \'X\'))';
            break;
        case 'ReservationItems':
            query = 'Completed ne \'X\' and (RequirementQuantity gt WithdrawalQuantity)';
            break;
        case 'StockTransportOrderItems':
            query = '(((OrderQuantity eq IssuedQuantity) and (IssuedQuantity eq 0)) or ((OrderQuantity gt IssuedQuantity) and (FinalDeliveryFlag ne \'X\' and DeliveryCompletedFlag ne \'X\')))';
            break;
        case 'ProductionOrderComponents':
            query = 'Completed ne \'X\' and ((RequirementQuantity eq 0) or (WithdrawalQuantity eq 0) or (RequirementQuantity gt WithdrawalQuantity))';
            break;
    }
    return query;
}
export function GetOpenItemsTargetQuery(parentEntity, parentData) {

    const target = HeaderToItemsEntitySetName[parentEntity];
    const openItemsQuery = GetOpenItemsQuery(target);
    let query = '';
    switch (target) {
        case 'PurchaseOrderItems':
            query = `$filter=(PurchaseOrderId eq '${parentData.PurchaseOrderId}')`;
            break;
        case 'ReservationItems':
            query = `$filter=ReservationNum eq '${parentData.ReservationNum}'`;
            break;
        case 'StockTransportOrderItems':
            query = `$filter=(StockTransportOrderId eq '${parentData.StockTransportOrderId}')`;
            break;
        case 'ProductionOrderComponents':
            query = `$filter=(OrderId eq '${parentData.OrderId}')`;
            break;
        case 'MaterialDocItems':
            query = `$filter=MaterialDocNumber eq '${parentData.MaterialDocNumber}' and MaterialDocYear eq '${parentData.MaterialDocYear}'`;
            break;
    }

    if (openItemsQuery) {
        query += ` and ${openItemsQuery}`;
    }
    return {target, query};
}

export function GetFirstOpenItemForDocument(context, parentEntity, parentData, queryOptions, queryListRequired) {
    const queryTarget = GetOpenItemsTargetQuery(parentEntity, parentData);
    const target = queryTarget.target;
    let query = queryTarget.query;
    if (queryOptions)
        query += queryOptions;
    if (target === 'MaterialDocItems') {
        query += '&$orderby=MatDocItem&$top=1';
    } else {
        query += '&$orderby=ItemNum&$top=1';
    }
    
    let queryList = [];
    if (queryListRequired)
        queryList = queryListRequired;
    return context.read('/SAPAssetManager/Services/AssetManager.service', target, queryList, query).then(results => {
        return results ? results.getItem(0) : undefined;
    }).catch(() => {
        return undefined;
    });
}

export function GetPOAccountAssignment(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'PurchaseOrderHeader')
        return GetFirstOpenItemForDocument(context, type, context.binding).then(item => {
            return item?.AcctAssgmtCat;
        });
    return '';
}

export function GetEDTControls(context) {
    let sections = context.getPageProxy().getControls()[0].getSections();
    let controlsArray = [];
    for (let index = 2; index < sections.length; index += 2) {
        controlsArray.push(sections[index].getExtension());
    }
    return controlsArray;
}
