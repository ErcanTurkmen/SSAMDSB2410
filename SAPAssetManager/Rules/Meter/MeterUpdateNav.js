import IsClassicLayoutEnabled from '../Common/IsClassicLayoutEnabled';
import libMeter from '../Meter/Common/MeterLibrary';
import MeterSectionLibrary from './Common/MeterSectionLibrary';

export default async function MeterUpdateNav(context, replaceBinding) {
    const binding = replaceBinding || await MeterSectionLibrary.getOrderIsuLinkDetailedBindingObject(context);

    if (binding?.ISUProcess?.substr(-5) !== '_EDIT') {
        libMeter.setMeterTransactionType(context, binding.ISUProcess + '_EDIT');
    }

    let readLink = binding['@odata.readLink'];
    if (context.getClientData().meterLink) readLink = context.getClientData().meterLink;

    return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [],'$expand=Device_Nav/DeviceCategory_Nav/Material_Nav,DeviceLocation_Nav/Premise_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderISULinks,Workorder_Nav/OrderMobileStatus_Nav').then(function(orderISULink) {
        if (orderISULink.getItem(0)) {
            context.setActionBinding(orderISULink.getItem(0));
        }
    }).catch(() => {
        let readlink = "OrderISULinks(DisconnectionNum='" + binding.DisconnectionNum + "',DeviceLocation='" + binding.DeviceLocation + "',DeviceCategory='" + binding.DeviceCategory + "',ConnectionObject='" + binding.ConnectionObject + "',EquipmentNum='" + binding.EquipmentNum + "',SerialNum='" + binding.SerialNum + "',Premise='" + binding.Premise + "',OrderNum='" + binding.OrderNum + "',Installation='" + binding.Installation + "',ISUProcess='" + binding.ISUProcess + "',FunctionalLoc='" + binding.FunctionalLoc + "')";
        return context.read('/SAPAssetManager/Services/AssetManager.service', readlink, [],'$expand=Device_Nav/DeviceCategory_Nav/Material_Nav,DeviceLocation_Nav/Premise_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderISULinks,Workorder_Nav/OrderMobileStatus_Nav').then(function(orderISULink) {
            if (orderISULink.getItem(0)) {
                context.setActionBinding(orderISULink.getItem(0));
            }
        });
    }).finally(() => {
        const REPLACE = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/ReplaceMeterType.global').getValue();
        const REP_INST = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/ReplaceInstallMeterType.global').getValue();
        if (!IsClassicLayoutEnabled(context) && (binding.ISUProcess !== REPLACE && binding.ISUProcess !== REP_INST)) {
            return context.executeAction('/SAPAssetManager/Rules/Meters/CreateUpdate/InstallMeterNav.js');
        }
        return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterCreateUpdateNav.action');
    });
}
