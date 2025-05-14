/**
* get service confirmation header caption (with id)
* @param {IClientAPI} clientAPI
*/
export default function GetConfirmationDetailsCaption(context) {
    let binding = context.binding;
    if (binding && binding.ObjectID) {
        return context.localizeText('confirmation_title', [binding.ObjectID]);
    }
}
