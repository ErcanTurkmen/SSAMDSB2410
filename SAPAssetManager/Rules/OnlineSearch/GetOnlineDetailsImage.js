import libVal from '../Common/Library/ValidationLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';
import { IsOnlineEntityAvailableOffline } from './IsOnlineEntityAvailableOffline';

export const imagesSet = {
    '#sap_mobile.Equipment': {
        offlineEntitySet: 'MyEquipments',
        onlineImage: 'EquipmentOnline',
        offlineImage: 'EquipmentOffline',
        id: 'EquipId',
    },
    '#sap_mobile.MyEquipment': {
        offlineEntitySet: 'MyEquipments',
        onlineImage: 'EquipmentOnline',
        offlineImage: 'EquipmentOffline',
        id: 'EquipId',
    },
    '#sap_mobile.FunctionalLocation': {
        offlineEntitySet: 'MyFunctionalLocations',
        onlineImage: 'FlocOnline',
        offlineImage: 'FlocOffline',
        id: 'FuncLocIdIntern',
    },
    '#sap_mobile.MyFunctionalLocation': {
        offlineEntitySet: 'MyFunctionalLocations',
        onlineImage: 'FlocOnline',
        offlineImage: 'FlocOffline',
        id: 'FuncLocIdIntern',
    },
    '#sap_mobile.MyWorkOrderHeader': {
        offlineEntitySet: 'MyWorkOrderHeaders',
        id: 'OrderId',
        onlineImage: 'OrderOnline',
        offlineImage: 'OrderOffline',
    },
    '#sap_mobile.WorkOrderHeader': {
        offlineEntitySet: 'MyWorkOrderHeaders',
        id: 'OrderId',
        onlineImage: 'OrderOnline',
        offlineImage: 'OrderOffline',
    },
    '#sap_mobile.MyNotificationHeader': {
        offlineEntitySet: 'MyNotificationHeaders',
        id: 'NotificationNumber',
        onlineImage: 'NotifOnline',
        offlineImage: 'NotifOffline',
    },
    '#sap_mobile.NotificationHeader': {
        offlineEntitySet: 'MyNotificationHeaders',
        id: 'NotificationNumber',
        onlineImage: 'NotifOnline',
        offlineImage: 'NotifOffline',
    },
};

export default async function GetOnlineDetailsImage(context) {
    if (PersonaLibrary.isClassicHomeScreenEnabled(context)) {
        return undefined;
    } else {
        const binding = context?.getPageProxy()?.binding || context?.getPageProxy()?.getActionBinding();
        if (!libVal.evalIsEmpty(binding)) { 
            const entity = imagesSet[binding['@odata.type']];
            // details from online search
            if (entity) {
                const isAvailableOffline = await IsOnlineEntityAvailableOffline(context, entity.offlineEntitySet, entity.id);
                return isAvailableOffline ? `$(PLT, /SAPAssetManager/Images/DetailImages/${entity.offlineImage}.png, /SAPAssetManager/Images/DetailImages/${entity.offlineImage}.android.png)` :
                `$(PLT, /SAPAssetManager/Images/DetailImages/${entity.onlineImage}.png, /SAPAssetManager/Images/DetailImages/${entity.onlineImage}.android.png)`;
            }
        }
        return '';
    }
}
