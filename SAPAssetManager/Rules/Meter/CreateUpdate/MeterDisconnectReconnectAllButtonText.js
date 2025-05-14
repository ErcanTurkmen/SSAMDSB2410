import MeterLibrary from '../Common/MeterLibrary';
import MeterSectionLibrary from '../Common/MeterSectionLibrary';

export default function MeterDisconnectReconnectAllButtonText(context) {
    const woBinding = MeterSectionLibrary.getWorkOrderBinding(context);
    const isuProcess = MeterLibrary.getISUProcess(woBinding.OrderISULinks);
    const { DISCONNECT } = MeterSectionLibrary.getMeterISOConstants(context);
    return isuProcess === DISCONNECT ? context.localizeText('disconnect_all') : context.localizeText('reconnect_all');
}
