import libCommon from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import libPersona from '../Persona/PersonaLibrary';

export default function NotificationTypeLstPkrDefault(context, bindingObject) {

    if (libVal.evalIsEmpty(bindingObject)) {
        bindingObject = context.binding;
    }

    if (bindingObject['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${bindingObject.InspectionLot_Nav.WOHeader_Nav.OrderType}', PlanningPlant='${bindingObject.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}')`, [], '').then(result => {
            if (result && result.length > 0) {
                return result.getItem(0).EAMNotifType;
            }
            return libCommon.getAppParam(context, 'NOTIFICATION', 'NotificationType');
        });
    }

    const hasBindingObject = checkBindingObject(bindingObject);

    if (hasBindingObject) {
        return bindingObject.NotificationType;
    } else if (libPersona.isMaintenanceTechnician(context)) {
        let defaultType = libCommon.getAppParam(context, 'NOTIFICATION', 'NotificationType');

        if (defaultType) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], `$filter=NotifType eq '${defaultType}'`).then(types => {
                if (types && types.length > 0) {
                    return types.getItem(0).NotifType;
                }
                
                return undefined;
            });
        }

        return undefined;
    }
}

function checkBindingObject(bindingObject) {
    return bindingObject && bindingObject.NotificationType;
}
