import libCommon from '../../Common/Library/CommonLibrary';
export default function IssueEnable(context, bindingObject) {

    let binding = bindingObject || context.binding;
    let stockItemCode = libCommon.getAppParam(context, 'PART', 'StockItemCategory');
    if (Object.prototype.hasOwnProperty.call(binding,'ItemCategory')) {
        if (binding.ItemCategory === stockItemCode) {
            return (libCommon.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.Parts.Issue') === 'Y');         
        } else {
            return false;
        }
    } else {
        return false;
    }
}
