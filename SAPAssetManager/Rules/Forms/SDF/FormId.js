/**
 * 
 * @param {IClientAPI} context 
 * @returns {string}
 */
export default function FormId(context) {
    return context.binding.FormInstanceID || '';
}
