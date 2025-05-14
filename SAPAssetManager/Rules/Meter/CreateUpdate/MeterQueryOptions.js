import libMeter from '../../Meter/Common/MeterLibrary';
import IsMeterTakeReadingFlow from './IsMeterTakeReadingFlow';

export default function MeterQueryOptions(context) {

    let meterTransactionType = libMeter.getMeterTransactionType(context);

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive ||
        context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
            meterTransactionType = context.binding.ISUProcess + '_EDIT';
    }
    
    if (meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST') {
        return "$orderby=Device&$filter=(Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav/SystemStatus eq 'I0184' or Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav/SystemStatus eq 'I0099')&$expand=Equipment_Nav,RegisterGroup_Nav/Division_Nav"; 
    } else if (meterTransactionType === 'REMOVE_EDIT' || meterTransactionType === 'REPLACE_EDIT') {
        return '$expand=Equipment_Nav,RegisterGroup_Nav/Division_Nav';
    } else if (meterTransactionType === 'REMOVE' || meterTransactionType === 'REPLACE' || meterTransactionType === 'INSTALL_EDIT' || meterTransactionType === 'REP_INST_EDIT') {
        return "$filter=Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav/SystemStatus eq 'I0100'&$expand=Equipment_Nav,RegisterGroup_Nav/Division_Nav";
    }

    if (IsMeterTakeReadingFlow(context)) {
        return `$filter=Device eq '${context.binding.Device_Nav.Device}'`;
    }

    return '';
}
