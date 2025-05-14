import libCommon from '../../Common/Library/CommonLibrary';

/**
* Gets value from sales org scenario list picker and gets Division value
* @param {IClientAPI} context
*/
export default function ServiceRequestDivisionValue(context) {
    const readLink = libCommon.getControlValue(libCommon.getTargetPathValue(context, '#Page:ServiceRequestCreateUpdatePage/#Control:SalesOrgLstPkr'));
    return libCommon.getEntityProperty(context, readLink, 'Division');
}
