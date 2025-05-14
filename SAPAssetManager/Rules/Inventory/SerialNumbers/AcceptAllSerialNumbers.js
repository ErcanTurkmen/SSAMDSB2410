import libCom from '../../Common/Library/CommonLibrary';
import SerialNumDisable from './SerialNumDisable';
import IsAndroid from '../../Common/IsAndroid';

export default function AcceptAllSerialNumbers(context) {
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers');
    const quantityPicker = context.getPageProxy().getControl('SectionedTable').getControl('BaseQuantityUOM');
    const quantityValue = quantityPicker.getValue().split(' ');
    const openQunatity = Number(quantityValue[0]);

    if (!openQunatity) {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/SerialNumbers/AcceptAllSelected.action');
    }

    if (openQunatity !== serialNumbers.actual.filter(item => !item.Description).length) {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/SerialNumbers/AcceptAllErrorMsg.action');
    }

    const result = serialNumbers.actual.map(item => {
        if (!item.Description) {
            item.selected = true;
        }

        return item;
    });

    SerialNumDisable(context, 0);
    quantityPicker.setValue(quantityValue.join(' '));
    libCom.getStateVariable(context, 'SerialNumbers', { actual: result, initial: serialNumbers.initial });

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
