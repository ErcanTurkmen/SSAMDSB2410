import MeterSectionLibrary from '../../../Meter/Common/MeterSectionLibrary';

export default function WorkOrderDetailsActivityQuery(context) {
    const woBinding = MeterSectionLibrary.getWorkOrderBinding(context);
    let isuProcess = woBinding.OrderISULinks[0].ISUProcess;
    if (isuProcess === 'DISCONNECT') {
        //ActivityType 01 is disconnect
        return "$filter=ActivityType eq '01'&$expand=DisconnectActivityType_Nav,DisconnectActivityStatus_Nav&$top=1";
    } else if (isuProcess === 'RECONNECT') {
        //ActivityType 03 is reconnect
        return "$filter=ActivityType eq '03'&$expand=DisconnectActivityType_Nav,DisconnectActivityStatus_Nav&$top=1";
    } else {
        return '';
    }
}
