import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetDeliveryDate(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'DeliveryDatePkr', 'date');
}
