import libCommon from '../../Common/Library/CommonLibrary';

/**
* Gets value from sales org scenario list picker and gets Distribution Channel value
* @param {IClientAPI} context
*/
export default function ServiceRequestDistributionChannelValue(context) {
    const readLink = libCommon.getControlValue(libCommon.getTargetPathValue(context, '#Page:ServiceRequestCreateUpdatePage/#Control:SalesOrgLstPkr'));
    return libCommon.getEntityProperty(context, readLink, 'DistributionChannel');
}
