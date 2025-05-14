import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetUom(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'UOMSimple');
}
