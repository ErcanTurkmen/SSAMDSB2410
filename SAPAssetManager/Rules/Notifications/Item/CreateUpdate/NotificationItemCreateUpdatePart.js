import notification from '../../NotificationLibrary';
import userFeaturesLib from '../../../UserFeatures/UserFeaturesLibrary';
import common from '../../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';

export default function NotificationItemCreateUpdatePart(context) {
    ResetValidationOnInput(context);
    ResetValidationOnInput(context.getPageProxy().getControl('FormCellContainer').getControl('PartDetailsLstPkr'));
    let binding = context.getPageProxy().binding;
    if (!userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue()) || !binding) {
        return notification.NotificationItemCreateUpdatePart(context);
    }
    const selection = context.getValue();
    const codeGroup = (selection.length > 0 && selection[0].ReturnValue) || '';

    if (!codeGroup || context.binding.EAMChecklist_Nav) {
        return notification.NotificationItemCreateUpdatePart(context);
    }

    if (binding['@odata.type'] === '#sap_mobile.MyNotificationHeader' || !binding['@odata.type']) {
        return notification.NotificationItemCreateUpdatePart(context);
    }

    const targetList = context.getPageProxy().evaluateTargetPathForAPI('#Control:PartDetailsLstPkr');
    const specifier = targetList.getTargetSpecifier();
    let notifLookup = Promise.resolve(binding.NotificationType);
    if (binding['@odata.type'] === '#sap_mobile.MyNotificationItem') {
        binding = binding.Notification;
        notifLookup = Promise.resolve(binding.NotificationType);
    } else if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        notifLookup = context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}',OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}')`, [], '')
            .then(types => types.getItem(0).QMNotifType);
    }
    return notifLookup
        .then(type => context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${type}')`, [], ''))
        .then(notifType => {
            const defect = (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic' || (binding.InspectionLot && Number(binding.InspectionLot) !== 0)); // Are we working with a Defect Notification or not?
            if (notifType.getItem(0).NotifCategory === '02' || defect) { // QM/PM Notification, Defect
                specifier.setDisplayValue('{{#Property:Code}} - {{#Property:CodeDescription}}');
                specifier.setReturnValue('{Code}');

                specifier.setEntitySet('PMCatalogCodes');
                specifier.setService('/SAPAssetManager/Services/AssetManager.service');

                common.setEditable(targetList, true);
                specifier.setQueryOptions(`$filter=CodeGroup eq '${codeGroup}' and Catalog eq '${notifType.getItem(0).CatTypeObjectParts}'&$orderby=Code`);
                return targetList.setTargetSpecifier(specifier);
            }
            // PM Notification, No Defect
            return notification.NotificationItemCreateUpdatePart(context);
        });
}
