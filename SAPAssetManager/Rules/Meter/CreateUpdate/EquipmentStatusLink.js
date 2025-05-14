
export default function EquipmentStatusLink(context) {
    return `${context.binding.Device_Nav['@odata.editLink']}/Equipment_Nav/ObjectStatus_Nav`;
}
