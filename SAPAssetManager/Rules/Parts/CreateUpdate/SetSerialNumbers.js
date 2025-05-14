import SetMaterialUoM from './SetMaterialUoM';
import Logger from '../../Log/Logger';
import SetBatch from '../../Inventory/IssueOrReceipt/SetBatch';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SetSerialNumbers(clientAPI) {
    libCom.setStateVariable(clientAPI, 'SerialNumbers', {actual: null, initial: null});
    let serialNumButton = clientAPI.getPageProxy().evaluateTargetPathForAPI('#Control:SerialPageNav');
    let quantityControl = libCom.getControlProxy(clientAPI.getPageProxy(), 'QuantitySimple');
    let materialNumControl = libCom.getControlProxy(clientAPI.getPageProxy(), 'MaterialNumber');
    let isOnlineSearchEnabled = libCom.getControlProxy(clientAPI.getPageProxy(), 'OnlineSwitch').getValue();
    let valuationTypeControl = clientAPI.getPageProxy().getControl('FormCellContainer').getControl('ValuationTypePicker');
    serialNumButton.setValue('');
    serialNumButton.setVisible(false);
    valuationTypeControl.setVisible(false);
    valuationTypeControl.setValue('');
    valuationTypeControl.setEditable(false);
    if (clientAPI.getValue().length) {
        let materialPickerValue = clientAPI.getValue()[0].ReturnValue;
        libCom.setStateVariable(clientAPI, 'MaterialReadLink',materialPickerValue);
        let entity = materialPickerValue;
        let service = '/SAPAssetManager/Services/AssetManager.service';
        let query = '$expand=MaterialPlant'; 
        clientAPI.read(service, entity, [], query).then(result => {
            if (result.getItem(0).MaterialPlant.SerialNumberProfile && result.getItem(0).MaterialPlant.ValuationCategory) { //selected material is split serialized
                setSerialNumber(); 
                setValuationPicker(result.getItem(0).MaterialNum);
            } else if (result.getItem(0).MaterialPlant.SerialNumberProfile) { //selected material is serialized
                setSerialNumber();
            } else if (result.getItem(0).MaterialPlant.ValuationCategory) { //selected material is split valuated
                setValuationPicker(result.getItem(0).MaterialNum);
            } else {
                serialNumButton.setVisible(false);
                quantityControl.setEditable(true);
            }
        }).catch(err => {
            Logger.error(`Failed to read Online MyEquipSerialNumbers: ${err}`);
            serialNumButton.setVisible(false);
            quantityControl.setEditable(true);
        });    

        if (isOnlineSearchEnabled && materialPickerValue.includes("MaterialNum='")) {
            let materialNum = materialPickerValue.split("MaterialNum='")[1].split("'")[0];
            materialNumControl.setValue(materialNum);
        }

        SetMaterialUoM(clientAPI);
    } else {
        libCom.setStateVariable(clientAPI, 'MaterialReadLink','');
        serialNumButton.setVisible(false);
        quantityControl.setEditable(true);
    }
    SetBatch(clientAPI);

    // To makes the valuation field visible
    function setValuationPicker(resultLink) {
        let specifier = valuationTypeControl.getTargetSpecifier();
        specifier.setEntitySet('MaterialValuations');
        specifier.setQueryOptions(`$filter=Material eq '${resultLink}'&$orderby=ValuationType asc`);
        specifier.setService('/SAPAssetManager/Services/AssetManager.service');
        valuationTypeControl.setEditable(true);
        valuationTypeControl.setTargetSpecifier(specifier);
        valuationTypeControl.setVisible(true);
        valuationTypeControl.redraw();
        quantityControl.setEditable(false);
        quantityControl.setValue('');
    }


    // To makes the serial number field visible
    function setSerialNumber() {
        serialNumButton.setVisible(true);
        quantityControl.setEditable(false);
    }
}
