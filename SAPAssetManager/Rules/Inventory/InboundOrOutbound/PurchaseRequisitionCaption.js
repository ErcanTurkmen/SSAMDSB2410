import libCom from '../../Common/Library/CommonLibrary';
import libInv from '../../Inventory/Common/Library/InventoryLibrary';
import Logger from '../../Log/Logger';
/**
* This function returns the Purchase Requisition Caption with count...
* @param {IClientAPI} context
*/
export default async function PurchaseRequisitionCaption(context) {
    let baseQuery = "IMObject eq 'PR'";
    let baseQueryFilter = '$filter=(' + baseQuery + ')';  
    try {
        return await libInv.removeDeletedItems(context,baseQueryFilter)
        .then(filter => libCom.getEntitySetCount(context, 'MyInventoryObjects', filter))
        .then(count => context.localizeText('purchase_requisition_x', [count]));
    } catch (error) {
        Logger.error('Inventory Overview',  error);
        return context.localizeText('purchase_requisition'); 
    }
}
