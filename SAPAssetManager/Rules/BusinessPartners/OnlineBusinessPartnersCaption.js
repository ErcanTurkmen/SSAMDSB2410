import OnlineBusinessPartnersCount from './OnlineBusinessPartnersCount';
/**
 * Returns the total count of business partners for an equipment.
 * @param {*} context 
 * @returns {Number} Total count of business partners.
 */
export default function OnlineBusinessPartnersCaption(context) {
    return OnlineBusinessPartnersCount(context).then((count) => {
        let params=[count];
        return context.localizeText('business_partner_caption', params);
    });
}
