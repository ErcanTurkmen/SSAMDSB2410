/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import IsGoodsIssueVisible from '../Inventory/Overview/IsGoodsIssueVisible';
import personalLib from '../Persona/PersonaLibrary';
export default function IsGoodIssueVisibleInDrawer(clientAPI) {
    return personalLib.isInventoryClerk(clientAPI) && IsGoodsIssueVisible(clientAPI);
}
