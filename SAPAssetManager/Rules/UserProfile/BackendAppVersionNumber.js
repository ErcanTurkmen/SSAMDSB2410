/**
 * This function reads user information from entity set UserGeneralInfos and extracts the backend version number 
 * of the mobile application being used. The application version is expected to be the last part of a string 
 * in the format "SAP_SERVICE_ASSET_MANAGER_XXXX", where "XXXX" is the version number.
 * 
 * @param {object} clientAPI - The MDK API client object.
 * @returns {Promise<string>} - A promise that resolves to the extracted application version number or an empty string.
 */
export default function BackendAppVersionNumber(clientAPI) {
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'UserGeneralInfos', [], '').then(items => {
        if (items && items.length > 0) {
            const appName = items.getItem(0).MobileApp; //Will return something like SAP_SERVICE_ASSET_MANAGER_2405.
            const appNameArray = appName.split('_');
            const appVersion = appNameArray[appNameArray.length - 1];
            return appVersion;
        }
        return '';
    });
}
