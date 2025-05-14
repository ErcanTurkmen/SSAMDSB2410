import comLib from '../../Common/Library/CommonLibrary';
import { PI_NOT_COUNTED_FILTER } from './PhysicalInventoryCountNavWrapper';

export default function PhysicalInventoryCountAllNav(context) {
    let binding = context.getPageProxy().getActionBinding();
    const orderBy = 'Item';
    const expand = 'MaterialPlant_Nav,PhysicalInventoryDocHeader_Nav';
    const sharedQuery = `PhysInvDoc eq '${binding.PhysInvDoc}' and FiscalYear eq '${binding.FiscalYear}'`;
    const baseQuery = `${sharedQuery} and ${PI_NOT_COUNTED_FILTER}`;
    let query = `$filter= ${baseQuery} &$orderby= ${orderBy} &$top=1 &$expand= ${expand}`;
    return comLib.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Rules/Inventory/PhysicalInventory/SetPhysicalInventoryCountHeaderExists.js', 'PhysicalInventoryDocItems', query);
}

