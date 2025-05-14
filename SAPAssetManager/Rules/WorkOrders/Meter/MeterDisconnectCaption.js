import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterDisconnectCaption(context) {
    const meterTransType = libMeter.getMeterTransactionType(context);
    if (meterTransType === 'DISCONNECT' || meterTransType === 'DISCONNECT_EDIT') {
        return context.localizeText('disconnect_meter');
    } else {
        return context.localizeText('reconnect_meter');
    }
}
