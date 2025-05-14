import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetRequisitionDate(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'RequisitionDatePkr', 'date');
}
