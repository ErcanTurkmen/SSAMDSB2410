import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import libInv from '../../Inventory/Common/Library/InventoryLibrary';
import InboundDeliveryFilter from '../InboundOrOutbound/InboundDeliveryFilter';
/**
* This function returns the Inbound Delivery Caption value with count
* @param {IClientAPI} context
*/
export default async function InboundDeliveryCaption(context) {
    
    let baseQueryFilter = '$filter=(' + InboundDeliveryFilter() + ')';
    try {
        return await libInv.removeDeletedItems(context,baseQueryFilter)
        .then(filter => libCom.getEntitySetCount(context, 'MyInventoryObjects', filter))
        .then(count => context.localizeText('default_download_inbound_settings_title_x', [count]));
    } catch (error) {
        Logger.error('Inventory Overview',  error);
        return context.localizeText('default_download_inbound_settings_title');
    }
}
