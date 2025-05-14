import notification from '../../NotificationLibrary';
import userFeaturesLib from '../../../UserFeatures/UserFeaturesLibrary';

export default function NotificationItemTaskGroupQuery(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
        let binding = context.getPageProxy().binding;

        if (binding['@odata.type'] !== '#sap_mobile.MyNotificationHeader') {
            if (binding['@odata.type'] === '#sap_mobile.MyNotificationItem' || binding['@odata.type'] === '#sap_mobile.MyNotificationTask') {
                binding = binding.Notification;
            } else if (binding['@odata.type'] === '#sap_mobile.MyNotificationItemTask') {
                binding = binding.Item.Notification;
            } else if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                binding.NotificationType = 'QM';
                binding.MainWorkCenter = binding.InspectionLot_Nav.WOHeader_Nav.WorkCenterInternalId;
            }
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${binding.NotificationType}')`, [], '').then(notifType => {
            if (notifType.getItem(0).NotifCategory === '02') { // QM Notification
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], `$filter=WorkCenterId eq '${binding.MainWorkCenter}'`).then(workcenter => {
                    return getQuery(workcenter, notifType);
                });
            } else { // PM Notification
                return notification.NotificationTaskActivityGroupQuery(context, 'CatTypeTasks');
            }

        });
    } else {
        return notification.NotificationItemTaskActivityGroupQuery(context, 'CatTypeTasks');
    }
}

function getQuery(workcenter, notifType) {
    if (workcenter.length > 0 && workcenter.getItem(0).QNotifTypeFlag !== 'X') { // Read from Workcenter
        return `$filter=CatalogProfile eq '${workcenter.getItem(0).CatalogProfile}' and Catalog eq '${notifType.getItem(0).CatTypeTasks}'&$orderby=Catalog,CatalogProfile,CodeGroup`;
    } else { // Read from Notification Type
        return `$filter=CatalogProfile eq '${notifType.getItem(0).CatalogProfile}' and Catalog eq '${notifType.getItem(0).CatTypeTasks}'&$orderby=Catalog,CatalogProfile,CodeGroup`;
    }
}
