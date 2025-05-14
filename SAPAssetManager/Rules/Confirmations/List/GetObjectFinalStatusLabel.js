/**
* get label for S4ServiceConfirmation final status, if it exists
* @param {IClientAPI} context
*/
export default function GetObjectFinalStatusLabel(context) {
    let binding = context.binding;
    if (binding && binding.FinalConfirmation === 'Y') {
        return context.localizeText('final_text');
    }
    return '';
}
