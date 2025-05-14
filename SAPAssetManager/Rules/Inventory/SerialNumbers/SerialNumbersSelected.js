import libCom from '../../Common/Library/CommonLibrary';
import SerialNumDisable from './SerialNumDisable';
import IsAndroid from '../../Common/IsAndroid';

export default function SerialNumbersSelected(context) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const target = context.getPageProxy().getActionBinding();
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers');
    let TempLine_SerialNumbers = [];
    const quantityPicker = context
        .getPageProxy()
        .getControl('SectionedTable')
        .getControl('BaseQuantityUOM');
    const quantityValue = quantityPicker.getValue().split(' ');
    const issueTransferRecipient =
        objectType === 'ADHOC' || objectType === 'TRF' || objectType === 'MAT';

    if (!Number(quantityValue[0]) && !target.selected && !issueTransferRecipient || target.Description || target.new) {
        return null;
    }

    const actualNumbers = serialNumbers.actual.map((item) => {
        if (item.SerialNumber === target.SerialNumber) {
            item.selected = !item.selected;
        }

        return item;
    });

    if (!issueTransferRecipient) {
        if (actualNumbers.length) {
            TempLine_SerialNumbers = actualNumbers.filter(item => item.selected);
        }
        if (TempLine_SerialNumbers.length >= quantityValue[0]) {
            SerialNumDisable(context, false);
        } else {
            SerialNumDisable(context, true);
        }
    }

    let totalCount = quantityValue[0] - TempLine_SerialNumbers.length;
    const ScanButton = context.getPageProxy().getControl('SectionedTable').getControl('ScanButton');
    ScanButton.setTitle(context.localizeText('scan_serial_number', [totalCount]));

    libCom.setStateVariable(context, 'SerialNumbers', {
        actual: actualNumbers,
        initial: serialNumbers.initial,
    });

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
