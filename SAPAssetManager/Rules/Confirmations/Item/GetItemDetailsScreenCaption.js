/**
* get service confirmation item header caption (with id)
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsScreenCaption(context) {
    let binding = context.binding;
    if (binding && binding.ObjectID) {
        return context.localizeText('confirmation_item_id', [binding.ObjectID]);
    }
}
