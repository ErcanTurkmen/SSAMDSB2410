/**
* This function enables/disables the serial number field
* @param {IClientAPI} context
*/
import libVal from '../../Common/Library/ValidationLibrary';
export default function SerialNumberEnabled(context) {
    if (context.getPageProxy().getControl('SectionedTable')) {
        const serialPicker = context.getPageProxy().getControl('SectionedTable').getControl('SerialNum').getValue();
        return !(libVal.evalIsEmpty(serialPicker));
    } else {
        return false;
    }
}
