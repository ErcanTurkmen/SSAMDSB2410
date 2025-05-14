import AssignedToLibrary from './AssignedToLibrary';

/** @param {IFormCellProxy} context  */
export default function AssignedToFilterButtonsKeyValue(context) {
    /** @type {import('./AssignedToLibrary').TypeAssignedToBinding} */
    const binding = context.getPageProxy().binding;
    const partnersNav = binding.PartnersNavPropName;
    return [
        ...(binding.AssignedToMePickerItem ? [binding.AssignedToMePickerItem] : []),
        {
            DisplayValue: context.localizeText('unassigned'),
            ReturnValue: AssignedToLibrary.GetUnassignedReturnValue(partnersNav),
        },
    ];
}
