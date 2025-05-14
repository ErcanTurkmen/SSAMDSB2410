import MeterLibrary from '../Common/MeterLibrary';
import MeterSectionLibrary from '../Common/MeterSectionLibrary';

export default function MeterDisconnectReconnectAllButtonVisible(context) {
    const woBinding = MeterSectionLibrary.getWorkOrderBinding(context);
    return MeterSectionLibrary.isTechObjectStarted(context, woBinding)
        .then((isStarted) => isStarted && setStatusForToolbarActions(context, woBinding));
}

function setStatusForToolbarActions(context, binding) {
    const isuProcess = MeterLibrary.getISUProcess(binding.OrderISULinks);

    return context.read('/SAPAssetManager/Services/AssetManager.service', binding.DisconnectActivity_Nav[0]['@odata.readLink'], [], '').then(disconnectActivityResult => {
        if (disconnectActivityResult && disconnectActivityResult.getItem(0)) {
            const disconnectActivity = disconnectActivityResult.getItem(0);
            const isDeviceBlocked = isuProcess === 'DISCONNECT' && disconnectActivity.ActivityStatus === '10';

            return context.read('/SAPAssetManager/Services/AssetManager.service', 'DisconnectionObjects', [], `$filter=DisconnectActivity_Nav/OrderId eq '${binding.OrderId}'&$expand=Device_Nav`).then(disconnectResult => {
                const isAllDeviceDisconnected = disconnectResult.every((item) => {
                    return item.Device_Nav.DeviceBlocked === isDeviceBlocked;
                });

                return !isAllDeviceDisconnected;
            });
        }

        return false;
    });
}
