import libCom from '../Common/Library/CommonLibrary';
import IsOnlineFunctionalLocation from './IsOnlineFunctionalLocation';

/**
* This rule first gets the child count for the current object, saves it and then calls navigation action to the hierarcy control page
* @param {IClientAPI} context
*/
export default function FunctionalLocationHierarchyPageNav(context) {
    const isOnline = IsOnlineFunctionalLocation(context);

    let funcLocId = context.binding.FuncLocIdIntern;

    let funcLocEntitySetName = 'MyFunctionalLocations';
    let equipmentEntitySetName = 'MyEquipments';
    if (isOnline) {
        funcLocEntitySetName = 'FunctionalLocations';
        equipmentEntitySetName = 'Equipments';
    }

    let equipChildrenCountPromise = libCom.getEntitySetCount(context, equipmentEntitySetName, "$filter=FuncLocIdIntern eq '" + funcLocId + "' and SuperiorEquip eq ''&$orderby=FuncLocIdIntern,SuperiorEquip", isOnline ? '/SAPAssetManager/Services/OnlineAssetManager.service' : undefined);
    let funcLocChildrenCountPromise = libCom.getEntitySetCount(context, funcLocEntitySetName, "$filter=SuperiorFuncLocInternId eq '" + funcLocId + "'&$orderby=SuperiorFuncLocInternId", isOnline ? '/SAPAssetManager/Services/OnlineAssetManager.service' : undefined);
    return Promise.all([equipChildrenCountPromise, funcLocChildrenCountPromise]).then(function(resultsArray) {
        if (resultsArray) {
            const totalChildCount = resultsArray[0] + resultsArray[1];
            context.binding.HC_ROOT_CHILDCOUNT = totalChildCount;
            context.getPageProxy().setActionBinding(context.binding);

            if (isOnline) {
                return context.executeAction('/SAPAssetManager/Actions/HierarchyControl/OnlineHierarchyControlPageNav.action');
            }
            return context.executeAction('/SAPAssetManager/Actions/HierarchyControl/HierarchyControlPageNav.action');
        }
        return Promise.resolve();
    });
}
