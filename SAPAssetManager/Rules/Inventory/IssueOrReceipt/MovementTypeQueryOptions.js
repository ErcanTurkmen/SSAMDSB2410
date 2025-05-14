import libCom from '../../Common/Library/CommonLibrary';
import { MovementTypes } from '../Common/Library/InventoryLibrary';

/** @param {{binding: MaterialDocItem | PurchaseOrderItem | ReservationItem | ProductionOrderItem | InboundDeliveryItem | OutboundDeliveryItem | ProductionOrderComponent | StockTransportOrderItem} | IClientAPI} context */
export default function MovementTypeQueryOptions(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const movementTypeVar = libCom.getStateVariable(context, 'CurrentDocsItemsMovementType');
    const movementType = libCom.getStateVariable(context, 'IMMovementType');
    const objectType = libCom.getStateVariable(context, 'IMObjectType');

    //Find the POItem record we are working with
    if (type === 'MaterialDocItem') {
        return GetMaterialDocItemFilter(movementType, context);
    } else if (type === 'PurchaseOrderItem' && movementType === 'R') {
        return GetMoveTypesFilter(context);
    } else if (type === 'ProductionOrderItem' || (type === 'StockTransportOrderItem' && movementType !== 'I')) { //Receipt
        return GetMovementTypeFilter(MovementTypes.t101);
    } else if (['ReservationItem', 'InboundDeliveryItem', 'OutboundDeliveryItem', 'ProductionOrderComponent'].includes(type)) { //Issue, pull from the item itself
        return GetMovementTypeFilter(context.binding.MovementType);
    } else if (type === 'StockTransportOrderItem' && movementType === 'I') { //Issue
        return GetMovementTypeFilter(MovementTypes.t351);
    }
    if (movementTypeVar) {
        return GetMovementTypeFilter(movementTypeVar);
    }
    if (checkMovementTypeOptions(movementType, objectType)) {
        return GetMovementTypeFilter([MovementTypes.t301, MovementTypes.t303, MovementTypes.t305, MovementTypes.t311, MovementTypes.t313, MovementTypes.t315, MovementTypes.t321, MovementTypes.t322, MovementTypes.t343, MovementTypes.t411]);
    } else if (movementType === 'I') {
        return GetMovementTypeFilter([MovementTypes.t201, MovementTypes.t202, MovementTypes.t222, MovementTypes.t221, MovementTypes.t231, MovementTypes.t261, MovementTypes.t262, MovementTypes.t281, MovementTypes.t282, MovementTypes.t551, MovementTypes.t552, MovementTypes.t553, MovementTypes.t555]);
    } else if (movementType === 'R') {
        return GetMovementTypeFilter([MovementTypes.t501, MovementTypes.t502]);
    }

    return "$orderby=MovementType,MovementTypeDesc&$filter=SpecialStockInd eq '' and ReceiptInd eq '' and Consumption eq ''";
}

function checkMovementTypeOptions(movementType, objectType) {
    return movementType === 'I' && objectType === 'TRF' || movementType === 'T';
}

function GetMoveTypesFilter(context) {
    let moveTypes = [MovementTypes.t101, MovementTypes.t103, MovementTypes.t107];
    if (context.binding.OpenQuantityBlocked !== 0) {
        moveTypes.push(MovementTypes.t105);
    }
    if (context.binding.OpenQtyValBlocked !== 0) {
        moveTypes.push(MovementTypes.t109);
    }
    moveTypes.sort();
    return GetMovementTypeFilter(moveTypes);
}

function GetMaterialDocItemFilter(movementType, context) {
    if (movementType === 'REV') {
        const filter = (Number(context.binding.MovementType) + 1).toString();
        if (context.binding.MovementType === MovementTypes.t103) {
            return GetMovementTypeFilter([MovementTypes.t104,MovementTypes.t124]);
        }
        return GetMovementTypeFilter(filter);
    } else if (movementType === 'RET') {
        return GetMovementTypeFilter([MovementTypes.t122, MovementTypes.t102]);
    }
    return GetMovementTypeFilter(context.binding.MovementType);
}

/** @param {string[] | string} types */
function GetMovementTypeFilterTerm(types) {
    const typesList = types instanceof Array ? types : [types];
    return typesList.map(t => `MovementType eq '${t}'`).join(' or ');
}

/** @param {string[] | string} types */
export function GetMovementTypeFilter(types) {
    return `$orderby=MovementType,MovementTypeDesc&$filter=(${GetMovementTypeFilterTerm(types)})`;
}
