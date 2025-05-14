import libCom from '../../Common/Library/CommonLibrary';
import libInv from '../../Inventory/Common/Library/InventoryLibrary';
import Logger from '../../Log/Logger';
/**
* This function returns the Physical Inventory caption along with count...
* @param {IClientAPI} context
*/
export default async function PhysicalInventoryCaption(context) {
    let baseQuery = "IMObject eq 'PI'";
    let baseQueryFilter = '$filter=(' + baseQuery + ')';
    try {
        return await libInv.removeDeletedItems(context,baseQueryFilter)
        .then(filter => libCom.getEntitySetCount(context, 'MyInventoryObjects', filter))
        .then(count => context.localizeText('physical_inventory_label_x', [count]));
    } catch (error) {
        Logger.error('Inventory Overview',  error);
        return context.localizeText('physical_inventory_label');
    }
}
