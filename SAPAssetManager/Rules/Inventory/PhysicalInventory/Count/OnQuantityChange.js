/**
* Describe this function...
* @param {IClientAPI} context
*/
import SerialNumDisable from '../../../Inventory/SerialNumbers/SerialNumDisable';
import libCom from '../../../Common/Library/CommonLibrary';
export default function OnQuantityChange(context) {
    libCom.clearValidationOnInput(context);
    const scanButton = context.getPageProxy().getControl('SectionedTable').getControl('ScanButton');
    const totalCount = SerialNumberEditable(context);
    scanButton.setTitle(context.localizeText('scan_serial_number', [totalCount]));
}

export function SerialNumberEditable(context) {
    let quantityValue = 0;
    if (context.getPageProxy().getControl('SectionedTable')) { 
       quantityValue = Number(context.getPageProxy().getControl('SectionedTable').getControl('QuantitySimple').getValue());
    } else {
       quantityValue  = Number(context.binding.entryQuantity);
    }
    const serialMap = libCom.getStateVariable(context, 'NewSerialMap');
    const serialLength = serialMap?.size || 0;
    const totalCount = quantityValue - serialLength ;
    SerialNumDisable(context, serialLength < quantityValue);
    return totalCount;
}
