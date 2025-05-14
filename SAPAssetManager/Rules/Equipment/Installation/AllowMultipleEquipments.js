
export default function AllowMultipleEquipments(context) {
    return !(context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation' && context.binding.SingleInstall === 'X');
}
