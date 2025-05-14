import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetItemCategory(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'ItemCategoryLstPkr');
}
