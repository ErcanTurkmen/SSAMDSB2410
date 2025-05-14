/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import getEWMDefiningRequests from './GetEWMDefiningRequests';

export default function  FetchDownloadDocuments(context) {
    let definingRequests = getEWMDefiningRequests(context);
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/EWM/Fetch/FetchDownloadDocuments.action',
        'Properties': {
            'DefiningRequests' : definingRequests,
        },
    });
}
