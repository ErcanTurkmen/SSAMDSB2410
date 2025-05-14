import ComLib from '../../../Common/Library/CommonLibrary';
import { ContainersListFilterAndSearchQuery } from './ContainersListQueryOptions';

export default function ContainersCountCaption(clientAPI) {
    const totalCountQueryOptions = ContainersListFilterAndSearchQuery(clientAPI);
    const countQueryOptions = ContainersListFilterAndSearchQuery(clientAPI, true, true);

    const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsContainers', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsContainers', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {
        if (count === totalCount) {
            return clientAPI.localizeText('all_caption', [totalCount]);
        }
        return clientAPI.localizeText('all_caption_double', [count, totalCount]);
    });
}
