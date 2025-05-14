import libInv from '../Common/Library/InventoryLibrary';
/** @param {IClientAPI} context  */
export default function PurchaseRequisitionItemDetailsPageNav(context) {
    const actionBinding = context.getPageProxy().getActionBinding();
    const isProd = actionBinding['@odata.type'].substring('#sap_mobile.'.length) === 'PurchaseRequisitionItem';
    if (isProd) {
        const entitySet = 'PurchaseRequisitionItems';
        const query = `$filter=PurchaseReqNo eq '${actionBinding.PurchaseReqNo}'&$expand=PurchaseRequisitionLongText_Nav,PurchaseRequisitionAddress_Nav,PurchaseRequisitionAcctAsgn_Nav,PurchaseRequisitionHeader_Nav&$orderby=PurchaseReqItemNo`;

        // set bindings
        libInv.SetItemDetailsBinding(context, entitySet, query);
        
        return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/PurchaseRequisitionItemDetails.action');
    }
}
