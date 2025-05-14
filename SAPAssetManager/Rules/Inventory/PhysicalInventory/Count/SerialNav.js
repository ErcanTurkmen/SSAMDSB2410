/**
* This function sets the serial number page properties
* @param {IClientAPI} context
*/
import { updateEntryQuantity } from '../../Validation/SerialNumberNav';
export default function SerialNav(context) {
   const control = context.getPageProxy().getControl('FormCellContainer');
   updateEntryQuantity(control,context);
   return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventorySerialNumbersNav.action');
}
