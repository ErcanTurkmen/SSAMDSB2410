import IsAndroid from '../../Common/IsAndroid';
import libCom from '../../Common/Library/CommonLibrary';
import SerialNumDisable from './SerialNumDisable';

export default function SerialNumbersDelete(context) {
    const target = context.getPageProxy().getActionBinding();
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers');
    let TempLine_SerialNumbers = [];
    const changedSerialNumbers = serialNumbers.actual.filter(
        (item) => item.SerialNumber !== target.SerialNumber,
    );
    const quantityPicker = context
        .getPageProxy()
        .getControl('SectionedTable')
        .getControl('BaseQuantityUOM');
    const quantityValue = quantityPicker.getValue().split(' ');

    if (changedSerialNumbers.length) {
        TempLine_SerialNumbers = changedSerialNumbers.filter(item => item.selected);
    }
    if (TempLine_SerialNumbers.length >= quantityValue[0]) {
        SerialNumDisable(context, false);
    } else {
        SerialNumDisable(context, true);
    }
    libCom.setStateVariable(context, 'SerialNumbers', {
        actual: changedSerialNumbers,
        initial: serialNumbers.initial,
    });
    let totalCount = quantityValue[0] - TempLine_SerialNumbers.length;
    const ScanButton = context.getPageProxy().getControl('SectionedTable').getControl('ScanButton');
    ScanButton.setTitle(context.localizeText('scan_serial_number', [totalCount]));
    context
        .getPageProxy()
        .getControl('SectionedTable')
        .getSection(
            `${IsAndroid(context)
                ? 'SerialNumbersObjectTableAndroid'
                : 'SerialNumbersObjectTable'
            }`,
        )
        .redraw();
}
