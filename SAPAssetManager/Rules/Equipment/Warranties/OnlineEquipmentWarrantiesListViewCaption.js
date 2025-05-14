import OnlineEquipmentWarrantiesCount from './OnlineEquipmentWarrantiesCount';
/**
 * Returns the total count of warranties for an equipment.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Warranties
 */
export default function OnlineEquipmentWarrantiesListViewCaption(context) {
    return OnlineEquipmentWarrantiesCount(context).then(count => {
        return context.localizeText('warranties_caption', [count]);
    });
}
