import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetQuantity(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'QuantitySimple');
}
