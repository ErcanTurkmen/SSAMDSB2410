/**
* This function enables/disables the Add serial number button whenever the serial number is entered
* @param {IClientAPI} context
*/
import libVal from '../../Common/Library/ValidationLibrary';
export default function OnSerialNumberChange(context) {
    const serialPicker = context.getPageProxy().getControl('SectionedTable').getControl('SerialNum').getValue();
    const serialButton = context.getPageProxy().getControl('SectionedTable').getControl('SerialButton');
    if (libVal.evalIsEmpty(serialPicker)) {
        serialButton.setEnabled(false);
    } else {
        serialButton.setEnabled(true);
    }
}
