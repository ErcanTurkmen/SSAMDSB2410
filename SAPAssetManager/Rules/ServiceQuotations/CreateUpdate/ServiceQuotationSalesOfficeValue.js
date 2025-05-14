import libCommon from '../../Common/Library/CommonLibrary';

/**
* Gets value from sales org scenario list picker and gets Sales Office value
* @param {IClientAPI} context
*/
export default function ServiceQuotationSalesOfficeValue(context) {
    const readLink = libCommon.getControlValue(libCommon.getTargetPathValue(context, '#Page:ServiceQuotationCreateUpdatePage/#Control:SalesOrgLstPkr'));
    return libCommon.getEntityProperty(context, readLink, 'SalesOffice');
}
