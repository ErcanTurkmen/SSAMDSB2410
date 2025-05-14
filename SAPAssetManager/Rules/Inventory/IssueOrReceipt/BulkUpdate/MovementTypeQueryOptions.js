import libCom from '../../../Common/Library/CommonLibrary';
import { MovementTypes } from '../../Common/Library/InventoryLibrary';
import { GetFirstOpenItemForDocument } from './BulkUpdateLibrary';
import { GetMovementTypeFilter } from '../MovementTypeQueryOptions';

/** @param {{binding: PurchaseOrderHeader | ReservationHeader | ProductionOrderHeader | StockTransportOrderHeader} | IClientAPI} context */
export default function MovementTypeQueryOptions(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const movementType = libCom.getStateVariable(context, 'IMMovementType');
    if (type === 'PurchaseOrderHeader' && movementType === 'R') {
        return GetMovementTypeFilter([MovementTypes.t101]); //Support only 101 movement type for PO bulk Update
    }  else if (['ReservationHeader'].includes(type)) { 
        return GetMovementTypesForReservation(context);
    } else if (['ProductionOrderHeader'].includes(type)) { //Only Issue scenario is supported
        return GetMovementTypeFilter(MovementTypes.t261);
    } else if (type === 'StockTransportOrderHeader' && movementType === 'I') { //Issue
        return GetMovementTypeFilter(MovementTypes.t351);
    }
    return undefined;
}

function GetMovementTypesForReservation(context) {
    const movementTypesAllowed = [MovementTypes.t201, MovementTypes.t221, MovementTypes.t261, MovementTypes.t281];
    return GetFirstOpenItemForDocument(context, 'ReservationHeader' , context.binding).then(item => {
        return (item?.MovementType && movementTypesAllowed.includes(item.MovementType)) ? GetMovementTypeFilter(item.MovementType) : undefined;
    });
}
