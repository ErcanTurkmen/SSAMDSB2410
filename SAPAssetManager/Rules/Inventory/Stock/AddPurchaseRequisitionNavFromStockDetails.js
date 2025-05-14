import AddPurchaseRequisitionNav from '../PurchaseRequisition/AddPurchaseRequisitionNav';

/** @param {IPageProxy & {binding: MaterialSLoc}} context  */
export default function AddPurchaseRequisitionNavFromStockDetails(context) {
    context.setActionBinding({
        Material: context.binding.Material.MaterialNum,
        Plant: context.binding.Plant,
        StorageLocation: context.binding.StorageLocation,
    });
    return AddPurchaseRequisitionNav(context);
}
