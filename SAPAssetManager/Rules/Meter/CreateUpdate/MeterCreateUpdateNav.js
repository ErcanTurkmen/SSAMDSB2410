import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';
import MeterLibrary from '../Common/MeterLibrary';

export default function MeterCreateUpdateNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=Device_Nav/GoodsMovement_Nav,Device_Nav/RegisterGroup_Nav,Device_Nav/DeviceCategory_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,Workorder_Nav').then(function(result) {
        let isuLink = result.getItem(0);
        context.setActionBinding(isuLink);

        if (isuLink.ISUProcess.substr(-5) !== '_EDIT') {
            MeterLibrary.setMeterTransactionType(context, isuLink.ISUProcess + '_EDIT');
        }

        if (IsClassicLayoutEnabled(context)) {
            return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterCreateUpdateNav.action');
        }
        
        return context.executeAction('/SAPAssetManager/Rules/Meters/CreateUpdate/InstallMeterNav.js');
    });
}
