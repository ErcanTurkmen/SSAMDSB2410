/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCom from '../../../Common/Library/CommonLibrary';
import { GetSerialNumberCaption } from '../../SerialNumbers/ScanSerialNumberCaption';
export default function ScanCaption(context) {
    const serialMap = libCom.getStateVariable(context, 'NewSerialMap');
    const serialLength = serialMap?.size || 0;
    let quantityValue = 0;
    if (context.getPageProxy().getControl('SectionedTable')) {
        quantityValue = Number(context.getPageProxy().getControl('SectionedTable').getControl('QuantitySimple').getValue());
        return GetSerialNumberCaption(context, quantityValue, serialLength);
    } else {
        quantityValue = context.binding.EntryQuantity || 0;
        return GetSerialNumberCaption(context,quantityValue, serialLength);
    }
    }


