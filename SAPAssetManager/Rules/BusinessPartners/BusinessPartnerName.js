import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';
import libEval from '../Common/Library/ValidationLibrary';
import contextConverter from '../Meter/BusinessPartners/BusinessPartnerContextConverter';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import CommonLibrary from '../Common/Library/CommonLibrary';

export default function BusinessPartnerName(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        contextConverter(context);
    }
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let name = wrapper.name();

    const currentPageName = CommonLibrary.getPageName(context);
    if (currentPageName === 'BusinessPartnersListViewPage' && wrapper.partnerType === 'S4' && context.getBindingObject()['@sap.isLocal']) {
        return context.localizeText('local_partner_name', [name || '-']);
    }

    return libEval.evalIsEmpty(name) ? '-' : name;
}
