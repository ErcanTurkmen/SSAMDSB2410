
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IControlProxy} controlProxy
*/
export default async function ZGetTechnicalObjectCodeGroup(context) {
    let binding = context.binding;
    let floc = binding.HeaderFunctionLocation || '';
    let equip = binding.HeaderEquipment || '';
    let type = binding.NotificationType || '';
    let { entitySet, groupQuery } = '';
    let onlineFlag = binding.OnlineFloc || binding.OnlineEquipment;
    try {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], `$filter=NotifType eq '${type}' and length(CatalogProfile) gt 0`).then(function (result) {
            let catalog = result.getItem(0)["CatTypeObjectParts"];
            if (equip) {
                entitySet = onlineFlag ? 'Equipments' : 'MyEquipments';
                groupQuery = "$filter=EquipId eq '" + equip + "' and length(CatalogProfile) gt 0";
            } else if (floc) {
                entitySet = onlineFlag ? 'FunctionalLocation' : 'MyFunctionalLocations';
                groupQuery = "$filter=FuncLocIdIntern eq '" + floc + "' and length(CatalogProfile) gt 0";
            } else {
                groupQuery = "";
            }
            if (groupQuery !== "") {
                if (onlineFlag) {
                    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', entitySet, [], groupQuery).then(function (results) {
                        if (results.length) {
                            let zcodegroup = results.getItem(0).ZCodeGroup || results.getItem(0).CatalogProfile;
                            return [{ 'ZCodeGroup': zcodegroup, 'ZCatalog': catalog }];
                        }
                    }).catch(error => {
                        Logger.error('NotificationItemPartGroupPickerItems', error);
                        return [{ 'ZCodeGroup': '', 'ZCatalog': catalog }];
                    });
                }
                else {
                    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], groupQuery).then(function (results) {
                        if (results.length) {
                            let zcodegroup = results.getItem(0).ZCodeGroup || results.getItem(0).CatalogProfile;
                            return [{ 'ZCodeGroup': zcodegroup, 'ZCatalog': catalog }];
                        }
                    }).catch(error => {
                        Logger.error('NotificationItemPartGroupPickerItems', error);
                        return [{ 'ZCodeGroup': '', 'ZCatalog': catalog }];
                    });
                }
            }
            else {
                return [{ 'ZCodeGroup': '', 'ZCatalog': catalog }];
            }
        });
    }
    catch (error) {
        Logger.error('NotificationItemPartGroupPickerItems', error);
        return [{ 'ZCodeGroup': '', 'ZCatalog': '' }];
    }
}
