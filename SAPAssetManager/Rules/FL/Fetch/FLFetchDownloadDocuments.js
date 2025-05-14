import getFLDefiningRequests from './GetFLDefiningRequests';

/**
 * This is used to predefine DefiningRequests property for the next action
 * @param {*} context 
 */
export default function FLFetchDownloadDocuments(context) {
    let definingRequests = getFLDefiningRequests(context);
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/FL/Fetch/FLFetchDownloadDocuments.action',
        'Properties': {
            'DefiningRequests' : definingRequests,
        },
    });
}
