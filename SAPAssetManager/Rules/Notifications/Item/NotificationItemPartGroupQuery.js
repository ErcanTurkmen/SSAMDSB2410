import notification from '../NotificationLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import { GetNotificationGroupQuery } from './NotificationItemDamageGroupQuery';

/** @param {IControlProxy} context */
export default function NotificationItemPartGroupQuery(context) {
    /** @type {MyNotificationHeader | MyWorkOrderHeader | InspectionCharacteristic | MyNotificationItem} */
    let binding = context.getPageProxy().binding;
    if (!userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue()) || binding.EAMChecklist_Nav) {
        return notification.NotificationTaskActivityGroupQuery(context, 'CatTypeObjectParts');
    }

    let notifLookup = Promise.resolve(binding.NotificationType);

    if (binding['@odata.type'] !== '#sap_mobile.MyNotificationHeader') {
        if (binding['@odata.type'] === '#sap_mobile.MyNotificationItem') {
            binding = binding.Notification;
            notifLookup = Promise.resolve(binding.NotificationType);
        } else if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
            notifLookup = context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}',OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}')`, [], '').then(orderTypes => orderTypes.getItem(0).QMNotifType);
            binding.MainWorkCenter = binding.InspectionLot_Nav.WOHeader_Nav.WorkCenterInternalId;
        }
    }
    return notifLookup.then(type => GetNotificationGroupQuery(context, type, binding, 'CatTypeObjectParts'));
}
