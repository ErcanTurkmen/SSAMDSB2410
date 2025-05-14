import libCommon from '../../Common/Library/CommonLibrary';

/**
* Gets value from sales org scenario list picker and gets Distribution Channel value
* @param {IClientAPI} context
*/
export default function ServiceOrderDistributionChannelValue(context) {
    const readLink = libCommon.getControlValue(libCommon.getTargetPathValue(context, '#Page:ServiceOrderCreateUpdatePage/#Control:SalesOrgLstPkr'));
    return libCommon.getEntityProperty(context, readLink, 'DistributionChannel');
}
