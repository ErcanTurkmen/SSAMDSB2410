import ComLib from '../../Common/Library/CommonLibrary';
import { VoyagesListFilterAndSearchQuery } from './VoyagesOnLoadQuery';

export default function VoyagesListCaption(clientAPI) {
    const totalCountQueryOptions = VoyagesListFilterAndSearchQuery(clientAPI);
    const countQueryOptions = VoyagesListFilterAndSearchQuery(clientAPI, true, true);

    const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsVoyages', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsVoyages', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {
        if (count === totalCount) {
            return clientAPI.localizeText('all_caption', [totalCount]);
        }
        return clientAPI.localizeText('all_caption_double', [count, totalCount]);
    });
}
