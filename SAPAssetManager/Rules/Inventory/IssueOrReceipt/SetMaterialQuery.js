import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function SetMaterialQuery(context) {
    let page = context.getPageProxy();
    let transferType = libCom.getControlProxy(page,'TransferSeg').getValue()[0].ReturnValue;
    let isTransferFrom = transferType === context.localizeText('from_vehicle');
    let plant;
    let storageLoc;
    let materialNumber = page.evaluateTargetPath('#Control:MaterialNumber').getValue();
    let onlineSwitch = page.evaluateTargetPath('#Control:OnlineSwitch').getValue();
    let materialLstPkr = libCom.getControlProxy(page,'MaterialLstPkr');
    let materialLstPkrSpecifier = materialLstPkr.getTargetSpecifier();
    materialLstPkr.setValue('');
    if (isTransferFrom) {
        plant = libCom.getUserDefaultPlant();
        storageLoc = libCom.getUserDefaultStorageLocation();
        materialLstPkrSpecifier.setQueryOptions(`$orderby=MaterialNum&$expand=Material,MaterialPlant&$filter=StorageLocation eq '${storageLoc}' and Plant eq '${plant}'`);
    } else {
        plant = libCom.getListPickerValue(libCom.getControlProxy(page,'PlantLstPkr').getValue());
        let isPlant = !libVal.evalIsEmpty(plant);
        storageLoc = libCom.getListPickerValue(libCom.getControlProxy(page,'StorageLocationLstPkr').getValue());
        let isSloc = !libVal.evalIsEmpty(storageLoc);
        let query = getQueryValue(isPlant, isSloc, storageLoc, plant);
        if (onlineSwitch) {
            query += materialNumber ? `and MaterialNum eq '${materialNumber}'` : '';
        }
        materialLstPkrSpecifier.setQueryOptions(query);
    }

    
    return materialLstPkr.setTargetSpecifier(materialLstPkrSpecifier, false);
}

function getQueryValue(isPlant, isSloc, storageLoc, plant) {
    if (isPlant && isSloc) {
        return `$orderby=MaterialNum&$expand=Material,MaterialPlant&$filter=StorageLocation eq '${storageLoc}' and Plant eq '${plant}'`;
    } else if (isPlant) {
        return `$orderby=MaterialNum&$expand=Material,MaterialPlant&$filter=Plant eq '${plant}'`;
    } else if (isSloc) {
        return `$orderby=MaterialNum&$expand=Material,MaterialPlant&$filter=StorageLocation eq '${storageLoc}'`;
    }
    return '$orderby=MaterialNum&$expand=Material,MaterialPlant';
}
