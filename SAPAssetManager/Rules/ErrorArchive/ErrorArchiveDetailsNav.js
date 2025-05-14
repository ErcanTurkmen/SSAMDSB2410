
import GetDetailsNavQueryOption from '../Common/GetDetailsNavQueryOption';

export default async function ErrorArchiveDetailsNav(context) {
    let binding = context.getPageProxy().getActionBinding();

    // Create an error object, and store the error's info into this object. And save this into ClientData
    let errorObject = {
        'Message': binding.Message,
        'RequestBody': binding.RequestBody,
        'RequestURL': binding.RequestURL,
        'HTTPStatusCode': binding.HTTPStatusCode,
        'ReadLink': binding['@odata.readLink'],
        'RequestID': binding.RequestID,
        'CustomHeaders': binding.CustomHeaders,
    };
    context.getPageProxy().getClientData().ErrorObject = errorObject;

    let affectedEntity = binding.AffectedEntity;

    if (affectedEntity && affectedEntity['@odata.readLink']) {
        let queryOption = GetDetailsNavQueryOption(affectedEntity['@odata.readLink']);  // query string or DataQueryBuilder
        queryOption = typeof queryOption === 'string' ? queryOption : (await queryOption.build());
        return context.read('/SAPAssetManager/Services/AssetManager.service', affectedEntity['@odata.readLink'], [], queryOption).then(result => {
            if (result && result.length) {
                const resultItem = result.getItem(0);
                resultItem.ErrorObject = errorObject;
                context.getPageProxy().setActionBinding(resultItem);
                return context.getPageProxy().executeAction('/SAPAssetManager/Actions/ErrorArchive/ErrorArchiveDetails.action');
            } else {
                return Promise.resolve(false);
            }
        });
    } else {
        return context.getPageProxy().executeAction('/SAPAssetManager/Actions/ErrorArchive/ErrorArchiveEntityNotFound.action');

    }
}

