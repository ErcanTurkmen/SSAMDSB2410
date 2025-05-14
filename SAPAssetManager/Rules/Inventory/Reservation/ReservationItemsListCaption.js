import ComLib from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

export default function ReservationItemsListCaption(clientAPI) {
    const queryOptions = "$filter=(ReservationNum eq '" + clientAPI.getPageProxy().binding.ReservationNum + "')";
    return ComLib.getEntitySetCount(clientAPI, 'ReservationItems', queryOptions).then(totalCount => {
        let params = [];
        let count = 0;
        try {
            count = clientAPI.evaluateTargetPath('#Count');
        } catch (error) {
            Logger.error('ReservationItemsListCaption', error);
        }
        params.push(count);

        if (totalCount && totalCount !== count) {
            params.push(totalCount);
            return clientAPI.localizeText('items_x_x', params);
        }
        return clientAPI.localizeText('items_x', params);
    });
}
