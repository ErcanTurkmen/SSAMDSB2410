import ComLib from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

export default function GetOutboundDeliveryItemsListCaption(clientAPI) {
    const queryOptions = `$filter=(DeliveryNum eq '${clientAPI.getPageProxy().binding.DeliveryNum}')`;
    return Promise.all([
        ComLib.getEntitySetCount(clientAPI, 'OutboundDeliveryItems', queryOptions),
        GetCountPropertyValue(clientAPI),
    ]).then(([totalCount, count]) => totalCount && totalCount !== count ? clientAPI.localizeText('items_x_x', [count, totalCount]) : clientAPI.localizeText('items_x', [count]));
}

function GetCountPropertyValue(clientAPI) {
    try {
        return clientAPI.evaluateTargetPath('#Count');
    } catch (error) {
        Logger.error('OutboundDeliveryItemsListCaption', error);
    }
    return 0;
}
