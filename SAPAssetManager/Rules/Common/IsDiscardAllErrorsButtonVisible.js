export default function IsDiscardAllErrorsButtonVisible(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', '').then(function(resultCount) {
        return resultCount > 0;
    });
}
