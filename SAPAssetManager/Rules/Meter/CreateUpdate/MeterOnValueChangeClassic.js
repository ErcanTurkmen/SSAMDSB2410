import libCommon from '../../Common/Library/CommonLibrary';
import libEval from '../../Common/Library/ValidationLibrary';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';

export default function MeterOnValueChangeClassic(context) {
    ResetValidationOnInput(context);

    let meterReturnValue = libCommon.getListPickerValue(context.getValue());
    if (meterReturnValue) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `Devices('${meterReturnValue}')`, [], '$expand=Equipment_Nav,DeviceCategory_Nav/Material_Nav,RegisterGroup_Nav/Division_Nav,Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav').then(result => {
            if (result && result.getItem(0)) {
                let myDevice = result.getItem(0);
                context.getPageProxy().getClientData().DeviceReadLink = myDevice['@odata.readLink'];
                context.getPageProxy().getClientData().DeviceCategory = myDevice.DeviceCategory;
                context.getPageProxy().getClientData().Division = myDevice.RegisterGroup_Nav.Division;
                context.getPageProxy().getClientData().Device = myDevice.Device;

                let deviceData = {};
                deviceData.manuFacturerNewValue = myDevice.Equipment_Nav.Manufacturer;
                deviceData.registerGroupNewValue = myDevice.RegisterGroup;
                deviceData.deviceNewValue = libEval.evalIsEmpty(myDevice.DeviceCategory_Nav.Material_Nav) ? myDevice.Equipment_Nav.EquipDesc : myDevice.DeviceCategory_Nav.Material_Nav.Description;
                deviceData.divisionNewValue = myDevice.RegisterGroup_Nav.Division_Nav.Division + ' - ' + myDevice.RegisterGroup_Nav.Division_Nav.Description;
                deviceData.equipmentSystemStatus = myDevice.Equipment_Nav ? myDevice.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.SystemStatus : '';

                updatePageControls(context.getPageProxy(), deviceData);
            }
            return true;
        });
    } else {
        updatePageControls(context.getPageProxy());
    }

    return true;
}

function updatePageControls(context, deviceData) {
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');

    const manufacturerControl = formCellContainer.getControl('ManufacturerProp');
    const registerGroupControl = formCellContainer.getControl('RegisterGroupProp');
    const deviceControl = formCellContainer.getControl('DeviceProp');
    const divisionControl = formCellContainer.getControl('DivisionProp');
    const movementTypeLstPkr = formCellContainer.getControl('MovementTypeLstPkr');
    const receivingPlantLstPkr = formCellContainer.getControl('ReceivingPlantLstPkr');
    const storageLocationLstPkr = formCellContainer.getControl('StorageLocationLstPkr');

    movementTypeLstPkr.setVisible(false);
    receivingPlantLstPkr.setVisible(false);
    storageLocationLstPkr.setVisible(false);
    manufacturerControl.setVisible(false);
    registerGroupControl.setVisible(false);
    deviceControl.setVisible(false);

    if (!deviceData) {
        manufacturerControl.setValue('');
        registerGroupControl.setValue('');
        deviceControl.setValue('');
        divisionControl.setValue('');
    } else {
        manufacturerControl.setVisible(true);
        registerGroupControl.setVisible(true);
        deviceControl.setVisible(true);

        const ESTOStatus = context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/ESTOStatus.global').getValue();
        if (deviceData.equipmentSystemStatus === ESTOStatus) {
            movementTypeLstPkr.setVisible(true);
            receivingPlantLstPkr.setVisible(true);
            storageLocationLstPkr.setVisible(true);
        }

        manufacturerControl.setValue(deviceData.manuFacturerNewValue);
        registerGroupControl.setValue(deviceData.registerGroupNewValue);
        deviceControl.setValue(deviceData.deviceNewValue);
        divisionControl.setValue(deviceData.divisionNewValue);
    }
}
