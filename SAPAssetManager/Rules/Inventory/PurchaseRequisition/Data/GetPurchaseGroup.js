import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetPurchaseGroup(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'PurchaseGroupLstPkr');
}
