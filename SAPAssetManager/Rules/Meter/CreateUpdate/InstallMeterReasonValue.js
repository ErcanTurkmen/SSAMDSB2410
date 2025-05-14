import libMeter from '../Common/MeterLibrary';
import MeterSectionLibrary from '../Common/MeterSectionLibrary';

export default function InstallMeterReasonValue(context) {
    const meterConstants = MeterSectionLibrary.getMeterISOConstants(context);
    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ActivityReason) {
        return context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ActivityReason;
    } else {
        let meterTransactionType = libMeter.getMeterTransactionType(context);
        if (meterTransactionType === meterConstants.INSTALL || meterTransactionType === meterConstants.REP_INST) {
            return '';
        } else {
            return context.binding.Device_Nav.ActivityReason;
        }
    }
}
