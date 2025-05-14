import { MovementTypes } from '../Common/Library/InventoryLibrary';

export default function MaterialDocumentTags(context) {
    const target = context.binding;
    const reservationMT = [MovementTypes.t201, MovementTypes.t221, MovementTypes.t261, MovementTypes.t281];
    let number = '';
    let order = '';

    if (target.MovementType === MovementTypes.t101 && target.PurchaseOrderNumber) {
        number = target.PurchaseOrderNumber;
        order = context.localizeText('purchase_order');
    } else if (target.MovementType === MovementTypes.t351 && target.PurchaseOrderNumber) {
        order = context.localizeText('sto');
        number = target.PurchaseOrderNumber;
    } else if (reservationMT.includes(target.MovementType) && target.ReservationNumber) {
        number = target.ReservationNumber;
        order = context.localizeText('reservation');
    }
    return [number, order, target.MovementType];
}
