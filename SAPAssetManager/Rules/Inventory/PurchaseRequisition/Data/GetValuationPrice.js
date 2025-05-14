import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetValuationPrice(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'PriceSimple');
}
