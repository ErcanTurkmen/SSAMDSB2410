import libCom from '../../Common/Library/CommonLibrary';
import SerialNumDisable from './SerialNumDisable';

export default function AddMoreSerialNumber(context) {
    const serialPicker = context.getPageProxy().getControl('SectionedTable').getControl('SerialNum');
    const newSerialNumber = serialPicker.getValue();
    const quantityPicker = context.getPageProxy().getControl('SectionedTable').getControl('BaseQuantityUOM');
    const quantityValue = quantityPicker.getValue().split(' ');
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers');
    const actualNumbers = serialNumbers.actual || [];
    const existNumber = actualNumbers.find(item => item.SerialNumber === newSerialNumber);
    let TempLine_SerialNumbers = [];

    if (!newSerialNumber) {
        return null;
    }

    if (existNumber) {
        if (existNumber.selected || existNumber.Description) {
            serialPicker.setValue('');
            return null;
        } else {
            existNumber.selected = true;
        }
    } else {
        actualNumbers.unshift({
            SerialNumber: newSerialNumber,
            selected: true,
            new: true,
        });
    }

    if (actualNumbers.length) {
        TempLine_SerialNumbers = actualNumbers.filter(item => item.selected);
    }
    if (TempLine_SerialNumbers.length >= quantityValue[0]) {
        SerialNumDisable(context, false);
    } else {
        SerialNumDisable(context, true);
    }
    let totalCount = quantityValue[0] - TempLine_SerialNumbers.length;
    const ScanButton = context.getPageProxy().getControl('SectionedTable').getControl('ScanButton');
    ScanButton.setTitle(context.localizeText('scan_serial_number', [totalCount]));

    quantityPicker.setValue(quantityValue.join(' '));
    libCom.setStateVariable(context, 'SerialNumbers', { actual: actualNumbers, initial: serialNumbers.initial });
    serialPicker.setValue('');
    context.getPageProxy().getControl('SectionedTable').redraw();
}
