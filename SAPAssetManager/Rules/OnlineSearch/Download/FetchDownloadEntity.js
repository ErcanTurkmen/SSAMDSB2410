
/**
* Download the online entity (equipment/floc) that was uploaded with OnDemandObjectCreate
* @param {IClientAPI} context
*/
export default function FetchDownloadEntity(context) {
    const pageProxy = context.getPageProxy();
    let binding = pageProxy.binding;
    if (!binding?.['@odata.readLink']) {
        binding = pageProxy.getActionBinding();
    }

    if (binding) {
        return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'ModifiedEntities', [], '').then((ModifiedEntityResults) => {
            const definingRequests = [];
            if (ModifiedEntityResults && ModifiedEntityResults.length > 0) {
                for (let index = 0; index < ModifiedEntityResults.length; index++) {
                    let entitysetName = ModifiedEntityResults.getItem(index).EntityName;
                    definingRequests.push({
                        'Name': entitysetName,
                        'Query': entitysetName,
                    });
                }
            }
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Inventory/Fetch/FetchDownloadDocuments.action',
                'Properties': {
                    'DefiningRequests': definingRequests,
                    'OnSuccess': '/SAPAssetManager/Rules/OnlineSearch/Download/DownloadSuccess.js',
                    'OnFailure': '',
                },
            });
        });
    }
    return Promise.reject();
}
