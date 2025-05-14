import libCommon from '../../Common/Library/CommonLibrary';

/**
* Gets value from sales org scenario list picker and gets Sales Org value
* @param {IClientAPI} context
*/
export default function ServiceRequestSalesRespOrgValue(context) {
	const readLink = libCommon.getControlValue(libCommon.getTargetPathValue(context, '#Page:ServiceRequestCreateUpdatePage/#Control:SalesOrgLstPkr'));
    return libCommon.getEntityProperty(context, readLink, 'SalesRespOrg');
}
