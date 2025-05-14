import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterIsVisible(context) {

    let meterTransactionType = libMeter.getMeterTransactionType(context);

    return !(meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST');
}
