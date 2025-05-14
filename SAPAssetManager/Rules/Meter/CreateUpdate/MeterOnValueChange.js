import CommonLibrary from '../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import { updateReadingsTable } from './InstallMeterPageOnLoaded';

export default function MeterOnValueChange(context) {
    ResetValidationOnInput(context);

    const pageProxy = context.getPageProxy();

    let meterReturnValue = CommonLibrary.getControlValue(context);
    if (meterReturnValue) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `Devices('${meterReturnValue}')`, [], '$expand=RegisterGroup_Nav/Division_Nav,Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav').then(async result => {
            if (result && result.getItem(0)) {
                let myDevice = result.getItem(0);

                pageProxy.getClientData().DeviceReadLink = myDevice['@odata.readLink'];
                pageProxy.getClientData().DeviceCategory = myDevice.DeviceCategory;
                pageProxy.getClientData().Division = myDevice.RegisterGroup_Nav.Division;
                pageProxy.getClientData().Device = myDevice.Device;

                updatePageControls(pageProxy, myDevice);
            }

            return Promise.resolve();
        });
    } else {
        updatePageControls(pageProxy);
    }

    return Promise.resolve();
}

function updatePageControls(pageProxy, deviceData) {
    const movementTypeLstPkr = CommonLibrary.getControlProxy(pageProxy, 'MovementTypeLstPkr');
    const receivingPlantLstPkr = CommonLibrary.getControlProxy(pageProxy, 'ReceivingPlantLstPkr');
    const storageLocationLstPkr = CommonLibrary.getControlProxy(pageProxy, 'StorageLocationLstPkr');
    const edtTable = CommonLibrary.getControlProxy(pageProxy, 'EditableDataTableExtensionSection');
    const divisionControl = CommonLibrary.getControlProxy(pageProxy, 'DivisionLstPkr');

    movementTypeLstPkr.setVisible(false);
    receivingPlantLstPkr.setVisible(false);
    storageLocationLstPkr.setVisible(false);

    if (!deviceData) {
        edtTable.setVisible(false);
        divisionControl.setValue('');
    } else {
        let registerData = deviceData.RegisterGroup_Nav;
        if (registerData) {
            edtTable.setVisible(true);
            updateReadingsTable(pageProxy, edtTable, registerData['@odata.readLink']);

            if (registerData.Division_Nav) {
                divisionControl.setValue(registerData.Division_Nav.Division);
            }
        }

        const ESTOStatus = pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/ESTOStatus.global').getValue();
        const equipmentSystemStatus = deviceData.Equipment_Nav ? deviceData.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.SystemStatus : '';
        if (equipmentSystemStatus === ESTOStatus) {
            movementTypeLstPkr.setVisible(true);
            receivingPlantLstPkr.setVisible(true);
            storageLocationLstPkr.setVisible(true);
        }
    }
}
