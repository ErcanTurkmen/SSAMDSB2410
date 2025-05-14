/**
* Check if it's a PRT document
* @param {IClientAPI} clientAPI
*/
export default function IsSaveAsVisible(clientAPI) {
    // Dont allow user to create a PRT document from the client
    if (clientAPI.binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
        return false;
    }
    return true;
}
