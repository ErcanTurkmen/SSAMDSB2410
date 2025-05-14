import getIMDefiningRequests from './GetIMDefiningRequests';

/**
* This is used to predefine DefiningRequests property for the next action
* @param {IClientAPI} context
*/
export default function FetchDownloadDocuments(context) {
    let definingRequests = getIMDefiningRequests(context);
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Inventory/Fetch/FetchDownloadDocuments.action',
        'Properties': {
            'DefiningRequests' : definingRequests,
        },
    });
}
