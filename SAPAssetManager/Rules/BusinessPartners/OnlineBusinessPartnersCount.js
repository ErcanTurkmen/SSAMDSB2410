import CommonLibrary from '../Common/Library/CommonLibrary';
import BusinessPartnerEntitySet from './BusinessPartnerEntitySet';
/**
 * Returns the total count of business partners for an equipment.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of business partners.
 */
export default function OnlineBusinessPartnersCount(context) {
    return BusinessPartnerEntitySet(context).then(entitySetName => {
        return CommonLibrary.getEntitySetCount(context, entitySetName, '', '/SAPAssetManager/Services/OnlineAssetManager.service');    
    });
}
