/**** for display in the objectcell, *NOT* what is passed to the form runner
 * 
 * @param {IClientAPI} context 
 * @returns {string}
 */
export default function FormStatus(context) {
    let status;

    switch (context.binding.DynamicFormInstance_Nav.FormStatus) {
        case 'New':
            status = context.localizeText('sdf_status_new');
            break;
        case 'In Process':
            status = context.localizeText('sdf_status_in_process');
            break;
        case 'Completed':
            status = context.localizeText('sdf_status_completed');
            break;
        case 'Reopened':
            status = context.localizeText('sdf_status_reopened');
            break;
        case 'Final':
            status = context.localizeText('sdf_status_final');
            break;
        case '':
        case undefined:
        case null:
            status = '-';
            break;
        default:
            status = context.binding.DynamicFormInstance_Nav.FormStatus;
            break;
    }

    return status;
}
