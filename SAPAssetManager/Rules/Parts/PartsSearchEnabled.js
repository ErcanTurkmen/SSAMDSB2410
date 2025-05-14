export default function PartsSearchEnabled(context) {
    if (!context.getPageProxy().binding['@odata.readLink']) return Promise.resolve(false);
    return context.count('/SAPAssetManager/Services/AssetManager.service', `${context.getPageProxy().binding['@odata.readLink']}/Components`, '').then(count => {
        return count !== 0;
    });
}
