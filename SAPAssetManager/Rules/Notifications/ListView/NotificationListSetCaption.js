import libVal from '../../Common/Library/ValidationLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import notificationTotalCount from '../NotificationsTotalCount';
import entitySet from '../NotificationEntitySet';
import notificationsListGetTypesQueryOption from './NotificationsListGetTypesQueryOption';

export default function NotificationListSetCaption(context, isListViewCaption) {
    return notificationsListGetTypesQueryOption(context).then(typesQueryOption => {
        let isOverviewNotificationListView = libCommon.getStateVariable(context, 'OverviewNotificationListView');
        if (isOverviewNotificationListView) {
            return context.localizeText('app_display_name');
        }

        let queryOption = libCommon.getQueryOptionFromFilter(context);
        let totalQueryOption = '';
        const params = [];

        if (libPersona.isFieldServiceTechnician(context) && typesQueryOption) {
            totalQueryOption = typesQueryOption;
            queryOption = appendFilterExpression(queryOption, typesQueryOption);
        }

        if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            if (libCommon.getStateVariable(context, 'OnFollowOnNotificationsList')) {
                let followOnFilter = `ReferenceNumber eq '${context.binding.OrderId}'`;
                totalQueryOption = followOnFilter;
                queryOption = appendFilterExpression(queryOption, followOnFilter);
            }
        }

        return notificationTotalCount(context, totalQueryOption).then((totalCount) => {
            return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet(context), queryOption).then(count => {
                params.push(count);
                params.push(totalCount);
                let caption;

                if (count === totalCount) {
                    caption = context.localizeText('notifications_x', [totalCount]);
                } else {
                    caption = context.localizeText('notifications_x_x', params);
                }
                return isListViewCaption ? context.setCaption(caption) : caption;
            });
        });
    });
}

function appendFilterExpression(query, exp) {
    if (query) {
        if (query === '$filter=') {
            query += exp;
        } else {
            query += ' and ' + exp;
        }
    } else {
        query = '$filter=' + exp;
    }

    return query;
}
