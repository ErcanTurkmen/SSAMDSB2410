import notification from '../NotificationLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/** @param {IControlProxy} context */
export default function NotificationItemDamageGroupQuery(context) {
    if (!userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
        return notification.NotificationTaskActivityGroupQuery(context, 'CatTypeDefects');
    }
    /** @type {MyNotificationHeader | MyWorkOrderHeader | InspectionCharacteristic | MyNotificationItem} */
    let binding = context.getPageProxy().binding;

    if (binding.EAMChecklist_Nav) {
        return notification.NotificationTaskActivityGroupQuery(context, 'CatTypeDefects');
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
    return notifLookup.then(type => GetNotificationGroupQuery(context, type, binding, 'CatTypeDefects'));
}

export function GetNotificationGroupQuery(context, notificationTypeId, binding, catalogFilterProp) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${notificationTypeId}')`, [], '').then(notifType => {
        if (notifType.getItem(0).NotifCategory === '02') { // QM Notification
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], `$filter=WorkCenterId eq '${binding.MainWorkCenter}'`).then(workcenter => {
                const catProfile = getCatProfile(workcenter, notifType);
                return `$filter=CatalogProfile eq '${catProfile}' and Catalog eq '${notifType.getItem(0)[catalogFilterProp]}'`;
            });
        }
        // PM Notification
        let defect = getDefectValue(binding); // Are we working with a Defect Notification or not?
        if (!defect) { // Standard PM Notification
            return notification.NotificationTaskActivityGroupQuery(context, catalogFilterProp);
        }
        // Defect PM Notification
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], `$filter=WorkCenterId eq '${binding.MainWorkCenter}'`).then(workcenter => {
            if (workcenter.length === 0) {
                return '';
            }
            const workCenter = workcenter.getItem(0);
            const reads = [
                workCenter.PMEquipFlag === 'X' && binding.HeaderEquipment ? context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${binding.HeaderEquipment}')`, [], '') : Promise.resolve(),
                workCenter.PMFuncLocFlag === 'X' && binding.HeaderFunctionLocation ? context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${binding.HeaderFunctionLocation}')`, [], '') : Promise.resolve(),
            ];

            return Promise.all(reads).then(equipment_floc => {// If Equipment or FLOC is present, return early with respective Catalog Profile, Otherwise return with Workcenter Catalog Profile
                const catalogProfile = (equipment_floc.every(i => ValidationLibrary.evalIsEmpty(i)) ? workCenter : equipment_floc.find(i => !ValidationLibrary.evalIsEmpty(i)).getItem(0)).CatalogProfile;
                return `$orderby=CodeGroup&$filter=CatalogProfile eq '${catalogProfile}' and Catalog eq '${notifType.getItem(0)[catalogFilterProp]}'`;
            });
        });
    });
}

function getDefectValue(binding) {
    return (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic' || (binding.InspectionLot && Number(binding.InspectionLot) !== 0));
}

function getCatProfile(workcenter, notifType) {
    return (workcenter.length > 0 && workcenter.getItem(0).QNotifTypeFlag !== 'X' ? workcenter : notifType).getItem(0).CatalogProfile;
}
