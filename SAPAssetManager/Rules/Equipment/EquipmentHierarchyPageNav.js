/**
* This rule first gets the child count for the current object, saves it and then calls navigation action to the hierarcy control page
* @param {IClientAPI} context
*/

import libCom from '../Common/Library/CommonLibrary';
import IsOnlineEquipment from './IsOnlineEquipment';

export default function EquipmentHierarchyPageNav(context) {
    const isOnline = IsOnlineEquipment(context);
    const equipmentEntitySetName = isOnline ? 'Equipments' : 'MyEquipments';
    const service = isOnline ? '/SAPAssetManager/Services/OnlineAssetManager.service' : '/SAPAssetManager/Services/AssetManager.service';
    let equipId = context.binding.EquipId;
    let funcLocId = context.binding.FuncLocIdIntern;
    let superiorEquipId = context.binding.SuperiorEquip;
    
    return context.read(service, context.binding['@odata.id'], [], '').then(function(results) {
        if (results.length > 0) {
            funcLocId = results.getItem(0).FuncLocIdIntern;
            superiorEquipId = results.getItem(0).SuperiorEquip;
        }
        return libCom.getEntitySetCount(context, equipmentEntitySetName, "$filter=SuperiorEquip eq '" + equipId + "'&$orderby=SuperiorEquip", service).then(result => {
            context.binding.HC_ROOT_CHILDCOUNT = result;
            // workaround for MDK bug
            context.binding.FuncLocIdIntern = funcLocId;
            context.binding.SuperiorEquip = superiorEquipId;
            context.getPageProxy().setActionBinding(context.binding);

            if (isOnline) {
                return context.executeAction('/SAPAssetManager/Actions/HierarchyControl/OnlineHierarchyControlPageNav.action');
            }
            return context.executeAction('/SAPAssetManager/Actions/HierarchyControl/HierarchyControlPageNav.action');
        });
    });
}
