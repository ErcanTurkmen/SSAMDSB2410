/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCom from '../../../Common/Library/CommonLibrary';
import libLocal from '../../../Common/Library/LocalizationLibrary';
export default function SaveSerialNumbers(context) {
    let serialMap = libCom.getStateVariable(context, 'NewSerialMap');
    const QuantitySimple = context.getPageProxy().getControl('SectionedTable').getControl('QuantitySimple');
    let entryQuantity = libLocal.toNumber(context, QuantitySimple.getValue()) || 0;
    if (serialMap.size !== entryQuantity) {
        let message = context.localizeText('serial_number_count', [serialMap.size, entryQuantity]);
        libCom.executeInlineControlError(context, QuantitySimple, message);
        return '';
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/CloseTopModal.action');
    }
}
