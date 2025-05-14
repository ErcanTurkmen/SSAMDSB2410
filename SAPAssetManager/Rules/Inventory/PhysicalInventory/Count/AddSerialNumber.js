import libCom from '../../../Common/Library/CommonLibrary';
import SerialNumDisable from '../../../Inventory/SerialNumbers/SerialNumDisable';
export default function AddSerialNumber(context) {

    const serialControl = context.getPageProxy().getControl('SectionedTable').getControl('SerialNum');
    const quantityValue = Number(context.getPageProxy().getControl('SectionedTable').getControl('QuantitySimple').getValue());
    let value = serialControl.getValue();
    if (value) {
        let serialMap = libCom.getStateVariable(context, 'NewSerialMap');
        if (!serialMap.has(value)) { //Serial not already in the list
            let serial = {};           
            serial.SerialNumber = value;
            serial.Date = new Date();
            serial.IsLocal = true;
            serial.IsNew = true;
            serialMap.set(value, serial);
            SerialNumDisable(context, serialMap.size < quantityValue);
            const totalCount = quantityValue - serialMap.size;
            const scanButton = context.getPageProxy().getControl('SectionedTable').getControl('ScanButton');
            scanButton.setTitle(context.localizeText('scan_serial_number', [totalCount]));
            context.getPageProxy().getControl('SectionedTable').redraw(); //redraw the serial list with the new item
        }
        serialControl.setValue('');
    }
}
