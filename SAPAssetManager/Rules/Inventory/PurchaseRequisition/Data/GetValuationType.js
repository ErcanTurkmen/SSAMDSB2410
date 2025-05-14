import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetValuationType(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'ValuationTypePicker');
}
