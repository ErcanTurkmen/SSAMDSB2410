import Logger from '../../Log/Logger';
import ComLib from '../../Common/Library/CommonLibrary';
import libInv from '../../Inventory/Common/Library/InventoryLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default async function GetInboundOutboundItemsCount(context) {
    let baseQueryFilter = '';
    try {
        return await libInv.removeDeletedItems(context,baseQueryFilter)
        .then(filter => ComLib.getEntitySetCount(context, 'MyInventoryObjects', filter))
        .then(totalCount => { 
            const count = context.evaluateTargetPath('#Count');
            try {
                if (typeof ( context.getPageProxy().getControl('SectionedTable'))!== 'undefined') {
                    let displayValue = context.getPageProxy().getControl('SectionedTable')._control._filterFeedbackItems[0]._displayValue;
                    if (displayValue === context.localizeText('default_download_inbound_settings_title')) {
                    context.getPageProxy().getControl('SectionedTable').redraw();
                    }
                }              
            } catch (err) {
                Logger.error('Inventory Overview', err);
                return '';
            }
            if (totalCount && totalCount !== count) {
                return context.localizeText('all_caption_double', [count, totalCount]);
            }
            return context.localizeText('all_caption', [totalCount]);
    });  
    } catch (error) {
    Logger.error('Inventory Overview',  error);
    return '';
    }
}

