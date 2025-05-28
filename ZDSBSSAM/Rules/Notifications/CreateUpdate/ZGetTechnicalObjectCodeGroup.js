
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';

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

    let catalog = await context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], `$filter=NotifType eq '${type}' and length(CatalogProfile) gt 0`).then(function(result){
        return result.getItem(0)["CatTypeObjectParts"];
    });
    if (floc && equip) {
        entitySet = 'MyEquipments';
        groupQuery = "$filter=EquipId eq '" + equip + "' and length(CatalogProfile) gt 0";
    } else if (floc) {
        entitySet = 'MyFunctionalLocations';
        groupQuery = "$filter=FuncLocIdIntern eq '" + floc + "' and length(CatalogProfile) gt 0";
    } else {
        groupQuery = "";
    }
    if (groupQuery !== "") {
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], groupQuery).then(function (results) {
            if (results.length > 0 && results.getItem(0).ZCodeGroup) {
                return { 'ZCodeGroup': results.getItem(0).ZCodeGroup, 'ZCatalog': catalog };
            }
        }).catch(error => {
            Logger.error('NotificationItemPartGroupPickerItems', error);
            return [];
        });
    }
    else {
        return '';
    }
}
