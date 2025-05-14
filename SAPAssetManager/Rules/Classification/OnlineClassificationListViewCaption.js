import Logger from '../Log/Logger';
import OnlineClassificationCount from './OnlineClassificationCount';

export default function OnlineClassificationListViewCaption(context) {
    return OnlineClassificationCount(context)
        .then(count => context.localizeText('classifications_x', [count]))
        .catch(err => {
            Logger.error('OnlineClassificationListViewCaption', err);
            return '';
        });
}
