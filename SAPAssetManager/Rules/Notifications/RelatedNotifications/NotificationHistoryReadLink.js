import libVal from '../../Common/Library/ValidationLibrary';

export default function NotificationHistoryEntitySet(sectionProxy) {
    let binding = sectionProxy.binding;
    let odataType = binding['@odata.type'];
    let entity = binding['@odata.readLink'];
    switch (odataType) {
        case '#sap_mobile.MyWorkOrderHeader':
            if (!libVal.evalIsEmpty(binding.HeaderEquipment)) {
                entity = binding['@odata.readLink'] + '/Equipment/NotifHistory_Nav';
            } else if (!libVal.evalIsEmpty(binding.HeaderFunctionLocation)) {
                entity = binding['@odata.readLink'] + '/FunctionalLocation/NotifHistory_Nav';
            } else {
                entity = binding['@odata.readLink'] + '/RelatedNotif_Nav';
            }
            break;
        case '#sap_mobile.MyWorkOrderOperation':
            if (!libVal.evalIsEmpty(binding.NotifNum)) {
                return sectionProxy.read('/SAPAssetManager/Services/AssetManager.service', `MyNotificationHeaders('${binding.NotifNum}')`, [], '$expand=Equipment/NotifHistory_Nav,FunctionalLocation/NotifHistory_Nav,NotifHistory_Nav').then(result => {
                    if (result && result.length) {
                        let notification = result.getItem(0);
                        if (!libVal.evalIsEmpty(notification.Equipment)) {
                            return notification.Equipment['@odata.readLink'] + '/NotifHistory_Nav';
                        } else if (!libVal.evalIsEmpty(notification.FunctionalLocation)) {
                            return notification.FunctionalLocation['@odata.readLink'] + '/NotifHistory_Nav';
                        } else {
                            return notification['@odata.readLink'] + '/NotifHistory_Nav';
                        }
                    }

                    if (!libVal.evalIsEmpty(binding.OperationEquipment)) {
                        return binding['@odata.readLink'] + '/EquipmentOperation/NotifHistory_Nav';
                    } else if (!libVal.evalIsEmpty(binding.OperationFunctionLocation)) {
                        return binding['@odata.readLink'] + '/FunctionalLocationOperation/NotifHistory_Nav';
                    }

                    return '';
                });
            }
            if (!libVal.evalIsEmpty(binding.OperationEquipment)) {
                entity = binding['@odata.readLink'] + '/EquipmentOperation/NotifHistory_Nav';
            } else {
                entity = binding['@odata.readLink'] + '/FunctionalLocationOperation/NotifHistory_Nav';
            }
            break;
        case '#sap_mobile.MyWorkOrderSubOperation':
            if (!libVal.evalIsEmpty(binding.OperationEquipment)) {
                entity = binding['@odata.readLink'] + '/EquipmentSubOperation/NotifHistory_Nav';
            } else {
                entity = binding['@odata.readLink'] + '/FunctionalLocationSubOperation/NotifHistory_Nav';
            }
            break;
        case '#sap_mobile.MyEquipment':
            entity = binding['@odata.readLink'] + '/NotifHistory_Nav';
            break;
        case '#sap_mobile.MyFunctionalLocation':
            entity = binding['@odata.readLink'] + '/NotifHistory_Nav';
            break;
        case '#sap_mobile.ConnectionObject':
            entity = binding['@odata.readLink'] + '/FuncLocation_Nav/NotifHistory_Nav';
            break;
        case '#sap_mobile.StreetRouteConnectionObject':
            entity = binding['@odata.readLink'] + '/ConnectionObject_Nav/FuncLocation_Nav/NotifHistory_Nav';
            break; 
        default:
            break;
    }

    return entity;
}
