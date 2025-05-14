
import MeterLibrary from '../Common/MeterLibrary';
import MeterSectionLibrary from '../Common/MeterSectionLibrary';

export default async function IsUninstallMeterAvailable(context) {
    const WOHeader = await MeterSectionLibrary.getWorkOrderDetailedBindingObject(context);

    return MeterSectionLibrary.isTechObjectStarted(context, WOHeader).then(function(isStarted) {
        if (isStarted) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', WOHeader['@odata.readLink']+'/OrderISULinks', [],'$expand=Device_Nav/DeviceCategory_Nav/Material_Nav,DeviceLocation_Nav/Premise_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderISULinks,Workorder_Nav/OrderMobileStatus_Nav&$filter=sap.entityexists(Device_Nav)').then(function(orderISULinks) {
                const REMOVE = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveMeterType.global').getValue();
                const binding = orderISULinks.getItem(0);
                if (orderISULinks.length === 1 && binding.ISUProcess === REMOVE) {
                    try {
                        if (MeterLibrary.isLocal(binding) && MeterLibrary.isProcessed(binding)) {
                            return false;
                        } else if (!MeterLibrary.isProcessed(binding)) {
                            return true;
                        }
                    } catch (exec) {
                        return true;
                    }
                }
                return false;
            });
        }
        return false;
    });
}
