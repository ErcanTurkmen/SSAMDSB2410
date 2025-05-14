/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import IsPhysicalInvVisible from '../Inventory/Overview/IsPhysicalInvVisible';
import personalLib from '../Persona/PersonaLibrary';
export default function IsPhysicalInvVisibleInDrawer(clientAPI) {
    return personalLib.isInventoryClerk(clientAPI) && IsPhysicalInvVisible(clientAPI);
}
