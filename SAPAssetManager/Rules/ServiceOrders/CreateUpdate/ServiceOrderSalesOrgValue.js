import libCommon from '../../Common/Library/CommonLibrary';

/**
* Gets value from sales org scenario list picker and gets Sales Org value
* @param {IClientAPI} context
*/
export default function ServiceOrderSalesOrgValue(context, page = 'ServiceOrderCreateUpdatePage') {
    const value = libCommon.getTargetPathValue(context, `#Page:${page}/#Control:SalesOrgLstPkr`);
	const readLink = libCommon.getControlValue(value);
    if (readLink) {
        return libCommon.getEntityProperty(context, readLink, 'SalesOrg');
    }
    return null;
}
