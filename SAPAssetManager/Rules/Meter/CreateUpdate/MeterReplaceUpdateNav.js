import libCommon from '../../Common/Library/CommonLibrary';
import libMeter from '../../Meter/Common/MeterLibrary';
import MeterSectionLibrary from '../Common/MeterSectionLibrary';
import meterReplaceInstallUpdateNav from './MeterReplaceInstallUpdateNav';

export default function MeterReplaceUpdateNav(context) {
    const replaceBinding = MeterSectionLibrary.getMeterReplaceBinding(context);
    const binding = replaceBinding || context.binding;
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [],'$expand=Device_Nav/DeviceCategory_Nav/Material_Nav,DeviceLocation_Nav/Premise_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderISULinks,Workorder_Nav/OrderMobileStatus_Nav').then(function(result) {
        if (result.getItem(0)) {
            let orderISULink = result.getItem(0);
            let isuLinks = orderISULink.Workorder_Nav.OrderISULinks;
            if (isuLinks.length === 1 && libMeter.isLocal(orderISULink) && libMeter.isProcessed(orderISULink)) {
                return meterReplaceInstallUpdateNav(context, replaceBinding);
            } else {
                libMeter.setMeterTransactionType(context);
                //set the CHANGSET flag to true
                libCommon.setOnChangesetFlag(context, true);
                if (replaceBinding) {
                    context.setActionBinding(replaceBinding);
                }
                return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterCreateUpdateNav.action');
            }
        }
        return '';
    });
}
