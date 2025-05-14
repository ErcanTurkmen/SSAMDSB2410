import MeterSectionLibrary from '../../Meter/Common/MeterSectionLibrary';

export default function DisconnectionTypeIsVisible(context) {
    const binding = MeterSectionLibrary.getWorkOrderBinding(context, context.getPageProxy().binding);
    const { DISCONNECT } = MeterSectionLibrary.getMeterISOConstants(context);
    return binding.OrderISULinks[0].ISUProcess === DISCONNECT;
}
