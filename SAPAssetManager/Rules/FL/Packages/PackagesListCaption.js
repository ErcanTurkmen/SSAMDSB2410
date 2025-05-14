import ComLib from '../../Common/Library/CommonLibrary';
import { PackagesListFilterAndSearchQuery } from './PackagesOnLoadQuery';

export default function PackagesListCaption(clientAPI) {
    const totalCountQueryOptions = PackagesListFilterAndSearchQuery(clientAPI);
    const countQueryOptions = PackagesListFilterAndSearchQuery(clientAPI, true, true);

    const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsPackages', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsPackages', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {
        if (count === totalCount) {
            return clientAPI.localizeText('all_caption', [totalCount]);
        }
        return clientAPI.localizeText('all_caption_double', [count, totalCount]);
    });
}
