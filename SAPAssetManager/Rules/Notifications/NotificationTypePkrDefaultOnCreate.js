import libCommon from '../Common/Library/CommonLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import libPersona from '../Persona/PersonaLibrary';
import ServiceNotificationTypesQueryOption from './Service/ServiceNotificationTypesQueryOption';

export default function NotificationTypePkrDefaultOnCreate(context) {
    /** @type {MyEquipment | MyFunctionalLocation | MyWorkOrderOperation | MyWorkOrderSubOperation | MyWorkOrderHeader} */
    let bindingObject = context.binding;
    if (bindingObject && bindingObject['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        let params = {
            OrderType: bindingObject.OrderType,
            PlanningPlant: bindingObject.PlanningPlant,
        };
        return getCorrespondingNotificationType(context, params);
    }
    return getDefaultNotificationType(context);
}

function getCorrespondingNotificationType(context, params) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${params.OrderType}', PlanningPlant='${params.PlanningPlant}')`, [], '')
        .then(types => !ValidationLibrary.evalIsEmpty(types) && types.getItem(0).NotifType ? types.getItem(0).NotifType : getDefaultNotificationType(context));
}

function getDefaultServiceNotificationTypes(context) {
    return ServiceNotificationTypesQueryOption(context, 'NotifType')
        .then(fsmNotifTypes => context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], `$filter=${fsmNotifTypes}&$orderby=NotifType&$top=1`));
}

function getDefaultNotificationType(context) {
    return getDefaultNotificationTypeObject(context)
        .then(typeObject => typeObject ? typeObject.NotifType : undefined);
}

export function getDefaultNotificationTypeObject(context) {
    if (libPersona.isFieldServiceTechnician(context)) {
        return getDefaultServiceNotificationTypes(context).then(types => types.length ? types.getItem(0) : undefined);
    }

    let defaultType = libCommon.getAppParam(context, 'NOTIFICATION', 'NotificationType');
    if (defaultType) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], `$filter=NotifType eq '${defaultType}'`)
            .then(types => types.length ? types.getItem(0) : undefined);
    }

    return Promise.resolve(undefined);
}
