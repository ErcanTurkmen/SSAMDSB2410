import ComLib from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

export default function PurchaseOrderItemsListCaption(clientAPI) {
    let type = clientAPI.getPageProxy().binding['@odata.type'].substring('#sap_mobile.'.length);
    let entitySet;
    let queryOptions = '$filter=';
    let caption;

    if (type === 'PurchaseOrderHeader') {
        queryOptions += "(PurchaseOrderId eq '" + clientAPI.getPageProxy().binding.PurchaseOrderId + "')";
        entitySet = 'PurchaseOrderItems';
        caption = 'PurchaseOrderItemsListCaption';

    } else if (type === 'StockTransportOrderHeader') {
        queryOptions += "(StockTransportOrderId eq '" + clientAPI.getPageProxy().binding.StockTransportOrderId + "')";
        entitySet = 'StockTransportOrderItems';
        caption = 'StockTransportOrderItemsListCaption';
    }
    return Promise.all([
        ComLib.getEntitySetCount(clientAPI, entitySet, queryOptions),
        GetCountPropertyValue(clientAPI,caption),
    ]).then(([totalCount, count]) => totalCount && totalCount !== count ? clientAPI.localizeText('items_x_x', [count, totalCount]) : clientAPI.localizeText('items_x', [count]));

}
    function GetCountPropertyValue(clientAPI,caption) {
        try {
            return clientAPI.evaluateTargetPath('#Count');
        } catch (error) {
            Logger.error(caption, error);
        }
        return 0;
    }



