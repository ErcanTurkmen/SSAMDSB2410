import libCommon from '../../Common/Library/CommonLibrary';
import libSearch from '../OnlineSearchLibrary';

export default function NotificationsListViewQueryOptions(context) {
    const notificationsTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/NotificationsTab.global').getValue();
    const queryOptions = libCommon.getQueryOptionFromFilter(context);
    const promise = libCommon.isDefined(queryOptions) ?
        libSearch.setTabCaptionWithCountAndEnableSelect(context.getPageProxy(), 'NotificationHeaders', queryOptions, notificationsTabName, 'notifications') :
        Promise.resolve();

    return promise.then(() => {
        return '';
    });
}
