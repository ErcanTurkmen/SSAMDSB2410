import CommonLibrary from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import SerialNumDisable from '../../Inventory/SerialNumbers/SerialNumDisable';
import BaseQuantityUOMValue from '../../Inventory/SerialNumbers/BaseQuantityUOMValue';
export default function OnQuantityChange(context) {
    let TempLine_SerialNumbers = [];
    return BaseQuantityUOMValue(context).then(results => {
        let quantity = context.getPageProxy().getControl('SectionedTable').getControl('BaseQuantityUOM');
        quantity.setValue(results);
        context.getPageProxy().getControl('SectionedTable').getControl('BaseQuantityUOM').redraw();
        const quantityValue = results.split(' ');
        const serialNumbers = CommonLibrary.getStateVariable(context, 'SerialNumbers');
        const actualNumbers = serialNumbers.actual || [];
        TempLine_SerialNumbers = actualNumbers && actualNumbers.filter(item => item.selected);
        if (libLocal.isNumber(context, quantityValue[0])) {
            let totalCount = quantityValue[0] - TempLine_SerialNumbers.length;
            const ScanButton = context.getPageProxy().getControl('SectionedTable').getControl('ScanButton');
            ScanButton.setTitle(context.localizeText('scan_serial_number', [totalCount]));
            if (TempLine_SerialNumbers.length >= quantityValue[0]) {
                SerialNumDisable(context, false);
            } else {
                SerialNumDisable(context, true);
            }
        }
    });
}
