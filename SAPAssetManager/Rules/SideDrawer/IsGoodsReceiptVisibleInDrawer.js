/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import IsGoodsReceiptVisible from '../Inventory/Overview/IsGoodsReceiptVisible';
import personalLib from '../Persona/PersonaLibrary';
export default function IsGoodsReceiptVisibleInDrawer(clientAPI) {
    return personalLib.isInventoryClerk(clientAPI) && IsGoodsReceiptVisible(clientAPI);
}
