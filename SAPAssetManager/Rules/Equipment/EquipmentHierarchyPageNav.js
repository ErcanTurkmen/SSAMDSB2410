import libCom from '../Common/Library/CommonLibrary';
import QueryBuilder from '../Common/Query/QueryBuilder';
import IsOnlineEquipment from './IsOnlineEquipment';

/**
* This rule first gets the child count for the current object, saves it and then calls navigation action to the hierarchy control page
* @param {IClientAPI} context
*/
export default async function EquipmentHierarchyPageNav(context) {
    const binding = context.getPageProxy().binding || {};
    const isOnline = IsOnlineEquipment(context, binding);
    const equipmentEntitySetName = isOnline ? 'Equipments' : 'MyEquipments';
    const service = isOnline ? '/SAPAssetManager/Services/OnlineAssetManager.service' : '/SAPAssetManager/Services/AssetManager.service';

    let equipId = binding.EquipId;
    let funcLocId = binding.FuncLocIdIntern;
    let superiorEquipId = binding.SuperiorEquip;
    
    await context.read(service, binding['@odata.id'], [], '').then(results => {
        if (results.length > 0) {
            funcLocId = results.getItem(0).FuncLocIdIntern;
            superiorEquipId = results.getItem(0).SuperiorEquip;
        }
    });

    const queryOptions = new QueryBuilder([`SuperiorEquip eq '${equipId}'`], '', '', ['orderby=SuperiorEquip']);

    const childCount = await libCom.getEntitySetCount(context, equipmentEntitySetName, queryOptions.build(), service);

    binding.HC_ROOT_CHILDCOUNT = childCount;
    // workaround for MDK bug
    binding.FuncLocIdIntern = funcLocId;
    binding.SuperiorEquip = superiorEquipId;
    context.getPageProxy().setActionBinding(binding);

    if (isOnline) {
        return context.executeAction('/SAPAssetManager/Actions/HierarchyControl/OnlineHierarchyControlPageNav.action');
    }

    return context.executeAction('/SAPAssetManager/Actions/HierarchyControl/HierarchyControlPageNav.action');
}
