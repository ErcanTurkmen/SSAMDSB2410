/** @param {IFormCellProxy} context  */
export default function AssignedToFilterButtons(context) {
        return [
            {
                DisplayValue: context.localizeText('unassigned'),
                ReturnValue: 'unassigned',
            },
            {
                DisplayValue: context.localizeText('assignedto'),
                ReturnValue: 'assigned',
            },
        ];
    }
