/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import IsPurchaseReqVisible from '../Inventory/Overview/IsPurchaseReqVisible';
import personalLib from '../Persona/PersonaLibrary';
export default function IsPurchaseReqVisibleInDrawer(clientAPI) {
    return personalLib.isInventoryClerk(clientAPI) && IsPurchaseReqVisible(clientAPI);
}
