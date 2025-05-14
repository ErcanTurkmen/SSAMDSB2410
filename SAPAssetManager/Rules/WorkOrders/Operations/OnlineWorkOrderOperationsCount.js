export default function OnlineWorkOrderOperationsCount(clientAPI) {
    const binding = clientAPI.getPageProxy().binding;
    return clientAPI.count('/SAPAssetManager/Services/OnlineAssetManager.service', binding['@odata.readLink'] + '/Operations', '');    
}
