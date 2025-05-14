/**
 * Returns the correct entityset for finding the material and serial number for an equipment.
 * If there is a notification on this object list row, get the equipment material from that object
 * @param {IClientAPI} context
 */
export default function ObjectListMaterialEntitySet(context) {
    let binding = context.getPageProxy().binding;

    if (binding.Material_Nav) {
        return binding['@odata.readLink'] + '/Material_Nav';
    } else if (binding?.NotifHeader_Nav?.Equipment?.SerialNumber?.Material) { //Make sure there is a notification with a material attached
        return binding['@odata.readLink'] + '/NotifHeader_Nav';
    } else if (binding?.Equipment_Nav?.SerialNumber?.Material || binding.MaterialNum) { //Make sure there is an equipment with a material attached or MaterialNum present
        return 'Materials';
    }

    return binding['@odata.readLink'];
}
