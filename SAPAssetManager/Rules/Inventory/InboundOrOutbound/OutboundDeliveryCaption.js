import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import libInv from '../../Inventory/Common/Library/InventoryLibrary';
import OutboundDeliveryFilter from '../InboundOrOutbound/OutboundDeliveryFilter';
/**
* This function returns the outbound delivery caption with count...
* @param {IClientAPI} context
*/
export default async function OutboundDeliveryCaption(context) {
    let baseQueryFilter = '$filter=(' + OutboundDeliveryFilter() + ')'; 
    try {
        return await libInv.removeDeletedItems(context,baseQueryFilter)
        .then(filter => libCom.getEntitySetCount(context, 'MyInventoryObjects', filter))
        .then(count => context.localizeText('default_download_outbound_settings_title_x', [count]));
    } catch (error) {
        Logger.error('Inventory Overview',  error);
        return context.localizeText('default_download_outbound_settings_title'); 
    }
}

