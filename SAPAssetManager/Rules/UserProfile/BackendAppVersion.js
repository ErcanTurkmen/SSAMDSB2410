/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function BackendAppVersion(clientAPI) {
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'UserGeneralInfos', [], '').then(items => {
        if (items && items.length > 0) {
            return items.getItem(0).MobileApp;
        }
        return '';
    });
}
