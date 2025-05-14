/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import IsStockTransferVisible from '../Inventory/Overview/IsStockTransferVisible';
import personalLib from '../Persona/PersonaLibrary';
export default function IsStockTransferVisibleInDrawer(clientAPI) {
    return personalLib.isInventoryClerk(clientAPI) && IsStockTransferVisible(clientAPI);
}
