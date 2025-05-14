import libCommon from '../../Common/Library/CommonLibrary';

/**
* Gets value from sales org scenario list picker and gets Sales Org value
* @param {IClientAPI} context
*/
export default function ServiceOrderSalesRespOrgValue(context, page = 'ServiceOrderCreateUpdatePage') {
    const readLink = libCommon.getControlValue(libCommon.getTargetPathValue(context, `#Page:${page}/#Control:SalesOrgLstPkr`));
    return libCommon.getEntityProperty(context, readLink, 'SalesRespOrg');
}
