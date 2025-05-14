import libCom from '../../Common/Library/CommonLibrary';
import GenerateLocalID from '../../Common/GenerateLocalID';

/**
* Describe this function...
* @param {ISideDrawerControlProxy} context
*/
export default function SetPhysicalInventoryCreate(context, extraOffset = 0) {
    const pageproxy = context.evaluateTargetPathForAPI('#Page:-Previous');
    //Set the global TransactionType variable to CREATE
    libCom.setOnCreateUpdateFlag(context, 'CREATE');
    return GenerateLocalID(context, 'PhysicalInventoryDocHeaders', 'PhysInvDoc', '0000', "$filter=startswith(PhysInvDoc, 'LOC_PI') eq true", 'LOC_PI', '', extraOffset).then(function(result) {
        libCom.setStateVariable(context, 'PhysicalInventoryLocalId', result);
        libCom.setStateVariable(context, 'PhysicalInventoryLocalFiscalYear', new Date().getFullYear().toString());
        libCom.setStateVariable(context, 'NewSerialMap', new Map());
        libCom.setStateVariable(context, 'PhysicalInventoryReturnToList', true);
        libCom.removeStateVariable(context, 'OldSerialRows');
        libCom.removeStateVariable(context, 'PhysicalInventoryItemPlant');
        libCom.removeStateVariable(context, 'PhysicalInventoryItemStorageLocation');
        libCom.removeStateVariable(context, 'PhysicalInventoryItemStockType');
        libCom.removeStateVariable(context, 'PhysicalInventoryItemWBSElementSimple');
        libCom.removeStateVariable(context, 'PhysicalInventoryItemVendorListPicker');
        libCom.removeStateVariable(context, 'PIDoneButtonPressed');
        pageproxy.setActionBinding('');
        return pageproxy.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCreateNav.action');
    });
}
