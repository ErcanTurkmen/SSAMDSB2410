import ComLib from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

export default function ProductionOrderItemsListCaption(clientAPI) {
    const queryOptions = "$filter=(OrderId eq '" + clientAPI.getPageProxy().binding.OrderId + "')";
    return ComLib.getEntitySetCount(clientAPI, 'ProductionOrderItems', queryOptions).then(totalCount => {
        let count = 0;
        try {
            count = clientAPI.evaluateTargetPath('#Count');
        } catch (error) {
            Logger.error('ProductionOrderItemsListCaption', error);
        }

        if (totalCount && totalCount !== count) {
            return clientAPI.localizeText('items_list_title_count_x', [count, totalCount]);
        }
        return clientAPI.localizeText('items_list_title_count', [count]);
    });
}
