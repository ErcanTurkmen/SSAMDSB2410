import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetValuationPriceUnit(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'PriceUnitSimple');
}
