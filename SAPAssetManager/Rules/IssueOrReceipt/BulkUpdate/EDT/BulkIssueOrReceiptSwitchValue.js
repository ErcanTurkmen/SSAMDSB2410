import libCom from '../../../Common/Library/CommonLibrary';
/**
 * This function sets the switch value based on previous selection. By default, the value is true.
 * @param {*} context context of the EDT row
 * @returns {boolean} return true/false for the switch value
 */
export default function BulkIssueOrReceiptSwitchValue(context) {
    const item = context.binding;
    const selectedItems = libCom.getStateVariable(context, 'BulkUpdateItemSelectionMap');
    return selectedItems ? selectedItems.includes(item.MatDocItem) : true;
}
