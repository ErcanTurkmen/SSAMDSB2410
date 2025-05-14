import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';
import libCommon from '../../Common/Library/CommonLibrary';
import libMeter from '../../Meter/Common/MeterLibrary';

export default async function MeterInstallUpdateNav(context) {
    let woBinding = await getWorkOrderBindingObject(context);

    libMeter.setMeterTransactionType(context, 'INSTALL');

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);

    let queryOption = '$expand=Device_Nav/RegisterGroup_Nav,' + 
                        'Device_Nav/DeviceCategory_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,' + 
                        'DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,' + 
                        'ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/DeviceLocations_Nav,' + 
                        'Premise_Nav/Installation_Nav,' + 
                        'DeviceLocation_Nav/Premise_Nav,' + 
                        'Workorder_Nav';

    let navActionName = IsClassicLayoutEnabled(context) ? '/SAPAssetManager/Actions/Meters/CreateUpdate/MeterCreateUpdateNav.action' : '/SAPAssetManager/Rules/Meters/CreateUpdate/InstallMeterNav.js';

    return libCommon.navigateOnRead(context, navActionName, woBinding.OrderISULinks[0]['@odata.readLink'], queryOption);
}

async function getWorkOrderBindingObject(context) {
    let woBinding = context.binding;
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        woBinding = await context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/WOHeader', [], '$expand=OrderISULinks').then(result => result.getItem(0));
    } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
        woBinding = await context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/WorkOrderOperation/WOHeader', [], '$expand=OrderISULinks').then(result => result.getItem(0));
    }

    return woBinding;
}
