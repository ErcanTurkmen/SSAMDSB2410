
import libMeter from '../../Meter/Common/MeterLibrary';
import MeterSectionLibrary from '../Common/MeterSectionLibrary';

export default function MeterDisconnectReconnectAllCaption(context) {
    const woBinding = MeterSectionLibrary.getWorkOrderBinding(context);
    let isuProcess = libMeter.getISUProcess(woBinding.OrderISULinks);

    if (isuProcess === 'DISCONNECT') {
        return context.localizeText('disconnect_all_meters');
    }
    return context.localizeText('reconnect_all_meters');
}
