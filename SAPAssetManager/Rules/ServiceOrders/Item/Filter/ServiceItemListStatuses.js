/**
* Get list of available statuses for Service Items
* @param {IClientAPI} clientAPI
*/
export default function ServiceItemListStatuses(clientAPI) {
    const itemStatusObjectType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ItemMobileStatusObjectType.global').getValue();
    const queryOptions = `$filter=ObjectType eq '${itemStatusObjectType}'&$select=MobileStatus`;
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], queryOptions).then((result) => {
        const items = [];
        if (result && result.length) {
            for (let i = 0; i < result.length; i++) {
                const statusItem = result.getItem(i);
                if (statusItem && statusItem.MobileStatus) {
                    items.push({
                        DisplayValue: clientAPI.localizeText(statusItem.MobileStatus),
                        ReturnValue: statusItem.MobileStatus,
                    });
                }
            }
        }
        return items;
    });
}
