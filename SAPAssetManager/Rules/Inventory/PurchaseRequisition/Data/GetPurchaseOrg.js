import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetPurchaseOrg(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'PurchansingOrganizationLstPkr');
}
