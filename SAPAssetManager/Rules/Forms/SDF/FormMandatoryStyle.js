/**
 * 
 * @param {IClientAPI} context 
 * @returns {string}
 */
export default function FormMandatoryStyle(context) {
    const binding = context.binding;

    if (binding 
        && binding.DynamicFormInstance_Nav.Mandatory === 'X') {
        return 'SDFMandatory' ;
    }
    return 'SDFOptional';
}
