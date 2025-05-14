/**
* This number calculates the count of the serial numbers to be displayed in the scan button caption
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import BaseQuantityUOMValue from './BaseQuantityUOMValue';
import { decodeUOM } from '../IssueOrReceipt/ShowQuantityInBaseUOM';
export default function ScanSerialNumberCaption(context) {

    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers');
    const actualNumbers = serialNumbers.actual || [];
    let TempLine_SerialNumbers = [];
    if (actualNumbers.length) {
        TempLine_SerialNumbers = actualNumbers.filter(item => item.selected);
    }
    if (context.getPageProxy().getControl('SectionedTable')) {
        const quantityPicker = context.getPageProxy().getControl('SectionedTable').getControl('BaseQuantityUOM');
        const [quantityValue] = decodeUOM(quantityPicker.getValue());
        return GetSerialNumberCaption(context, quantityValue, TempLine_SerialNumbers.length);

    } else {
        return BaseQuantityUOMValue(context).then(result => {
            const [quantityValue] = decodeUOM(result);
            return GetSerialNumberCaption(context, quantityValue, TempLine_SerialNumbers.length);
        });

    }
}

export function GetSerialNumberCaption(context, quantityValue, length) {
    const totalCount = quantityValue ? (quantityValue - length) : 0;
    return context.localizeText('scan_serial_number', [totalCount]);
}
