import CommonLibrary from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
/**
 * Returns the total count of work order history objects for an asset.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Workorder history objects.
 */
//upgrade 2410 done
export default function PRTCount(context) {
    let queryString = '';
    if (context.getName()) {
        let name = context.getParent().getName();
        switch (name) {
            case 'Equipment':
                queryString = '$filter=(PRTCategory eq \'E\')';
                break;
            case 'Material':
                queryString = '$filter=(PRTCategory eq \'M\')';
                break;
            case 'Miscellaneous':
            	//DSB customistion to change miscellaneous category to A instead of O for Danish language. 
            	//This should be fixed in std.
            	//PRTlistView and PRTMIscelleanous page, PRTTotalCount.js also has been udated
                queryString = '$filter=(PRTCategory eq \'A\')';
                break;
            case 'Document':
                queryString = '$filter=(PRTCategory eq \'D\')';
                break;
            case 'Point':
                queryString = '$filter=(PRTCategory eq \'P\')&$expand=PRTPoint/MeasurementDocs';
                break;
            default:
                break;
        }
    }
    return CommonLibrary.getEntitySetCount(context,context.getPageProxy().binding['@odata.readLink']+'/Tools', queryString);
}
