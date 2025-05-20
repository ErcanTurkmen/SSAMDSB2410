import CommonLibrary from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
/**
 * Returns the total count of work order history objects for an asset.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Workorder history objects.
 */
export default function PRTTotalCount(context) {
    //DSB customistion to change miscellaneous category to A instead of O for Danish language. 
    //This should be fixed in std.
    //PRTlistView and PRTMIscelleanous page, PRTCount.js also has been udated
        
    let queryStrings = [
        '$filter=(PRTCategory eq \'E\')',
        '$filter=(PRTCategory eq \'M\')',
        '$filter=(PRTCategory eq \'O\')',
        '$filter=(PRTCategory eq \'D\')',
        '$filter=(PRTCategory eq \'P\')&$expand=PRTPoint/MeasurementDocs',
        '$filter=(PRTCategory eq \'A\')',
    ];
    let promises = [];
    for (let item of queryStrings) {
        const service = context.getPageProxy().binding['@odata.type'] === '#sap_mobile.WorkOrderOperation' ? '/SAPAssetManager/Services/OnlineAssetManager.service' : '/SAPAssetManager/Services/AssetManager.service';
        promises.push(CommonLibrary.getEntitySetCount(context, context.getPageProxy().binding['@odata.readLink'] + '/Tools', item, service));
    }
    return Promise.all(promises).then((counts) => {
        return counts.reduce(add, 0);
    });
    
}

function add(a,b) {
    return a + b;
}
