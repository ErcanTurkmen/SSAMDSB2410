import ComLib from '../../../Common/Library/CommonLibrary';
import { HUDelItemsListFilterAndSearchQuery } from './HUDelItemsOnLoadQuery';

export default function HUDelItemsListCaption(clientAPI) {
    const totalCountQueryOptions = HUDelItemsListFilterAndSearchQuery(clientAPI);
    const countQueryOptions = HUDelItemsListFilterAndSearchQuery(clientAPI, true, true);

    const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsHuDelItems', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsHuDelItems', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {
        if (count === totalCount) {
            return clientAPI.localizeText('all_caption', [totalCount]);
        }
        return clientAPI.localizeText('all_caption_double', [count, totalCount]);
    });
}
