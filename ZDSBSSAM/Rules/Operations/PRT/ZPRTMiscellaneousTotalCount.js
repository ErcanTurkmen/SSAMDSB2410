import CommonLibrary from '../../Common/Library/CommonLibrary';
/**
 * Returns the total count of work order history objects for an asset.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Workorder history objects.
 */
export default function ZPRTMiscellaneousTotalCount(context) {
    let queryString = '';
    queryString = '$filter=(PRTCategory eq \'O\')';

    return CommonLibrary.getEntitySetCount(context, context.getPageProxy().binding['@odata.readLink'] + '/Tools', queryString);
}
