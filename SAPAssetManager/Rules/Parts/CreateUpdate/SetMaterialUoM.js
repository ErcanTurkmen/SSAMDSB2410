import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';
import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import SetAvailableQuantity from './SetAvailableQuantity';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';


export default function SetMaterialUoM(context) {
    //On material change, re-filter MaterialUOMLstPkr by material
    try {
        let isMultipleTechnician = EnableMultipleTechnician(context);
        let pageName = libCom.getPageName(context.getPageProxy());
        if (pageName === 'PartCreateUpdatePage') {
            // need to enable several Batch in case we call it from Add Part page
            isMultipleTechnician = false;
        }
        let materialUOMListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:MaterialUOMLstPkr');
        let batchListPicker = !isMultipleTechnician && context.getPageProxy().evaluateTargetPathForAPI('#Control:BatchNumberLstPkr');
        let materialUOMLstPkrSpecifier = materialUOMListPicker.getTargetSpecifier();
        let materialUOMLstPkrQueryOptions = '$select=UOM&$orderby=UOM';
        let materialUOMs = '';
        let onlineSwitch;
        if (pageName !== 'VehiclePartCreate') {
            onlineSwitch = context.getPageProxy().evaluateTargetPath('#Control:OnlineSwitch').getValue();

        }
        let service = onlineSwitch ? '/SAPAssetManager/Services/OnlineAssetManager.service' : '/SAPAssetManager/Services/AssetManager.service';
        
        ResetValidationOnInput(context); // clear validation error if any when the list is not empty
        if (context.getValue().length > 0) {
            let returnValue = context.getValue()[0].ReturnValue;
            let readLinkData = SplitReadLink(returnValue);
            let query = onlineSwitch 
            ? `$filter=Plant eq '${readLinkData.Plant}' and StorageLocation eq '${readLinkData.StorageLocation}' and MaterialNum eq '${readLinkData.MaterialNum}'`
            : '';
            if (onlineSwitch) {
                materialUOMs = 'MaterialUOMs';
                returnValue = 'MaterialSLocs';
            } else {
                materialUOMs = returnValue + '/Material/MaterialUOMs';
            }
            if (isMultipleTechnician && (pageName === 'VehiclePartCreate' || pageName === 'VehicleIssueOrReceiptCreatePage')) {
                SetAvailableQuantity(context);
            }
            context.read(service, returnValue, [], query).then(result => {
                if (result && result.getItem(0)) {
                    let material = result.getItem(0);
                    materialUOMLstPkrQueryOptions += `&$filter=MaterialNum eq '${material.MaterialNum}'`;
                    materialUOMLstPkrSpecifier.setQueryOptions(materialUOMLstPkrQueryOptions);
                    materialUOMLstPkrSpecifier.setEntitySet(materialUOMs);
                    materialUOMLstPkrSpecifier.setService(service);
                    resetMaterialUOMValue(context, materialUOMListPicker);
                    materialUOMListPicker.setTargetSpecifier(materialUOMLstPkrSpecifier);
                    ResetValidationOnInput(materialUOMListPicker);
                    let isBatch = material.BatchIndicator === 'X';
                    if (batchListPicker && !isMultipleTechnician) {
                        batchListPicker.setVisible(isBatch);
                        
                        if (isBatch) {
                            let batchLstPkrSpecifier = batchListPicker.getTargetSpecifier();
                            batchLstPkrSpecifier.setQueryOptions(`$filter=MaterialNum eq '${material.MaterialNum}' and Plant eq '${material.Plant}'`);
                            batchListPicker.setTargetSpecifier(batchLstPkrSpecifier);
                        }
                    }
                }
            }).catch(err => {
                Logger.error(`Failed to read Online MaterialSLocs: ${err}`);
            });
        } else {
            materialUOMs = 'MaterialUOMs';
            materialUOMLstPkrQueryOptions += '&$filter=MaterialNum eq \'\'';
            materialUOMLstPkrSpecifier.setQueryOptions(materialUOMLstPkrQueryOptions);
            materialUOMLstPkrSpecifier.setEntitySet(materialUOMs);
            resetMaterialUOMValue(context, materialUOMListPicker);
            materialUOMListPicker.setTargetSpecifier(materialUOMLstPkrSpecifier);
            if (batchListPicker) {
                batchListPicker.setVisible(false);
            }
        }
        
        if (!isMultipleTechnician && context.binding) {
            if (context.binding['@odata.type'] === '#sap_mobile.BOMItem') {
                materialUOMListPicker.setValue(context.binding.UoM);
                materialUOMListPicker.setEditable(false);
            }
            if (batchListPicker) {
                batchListPicker.setValue('');
            }
        }
        // If Storage Location picker is empty, set it to the current item's SLoc
        //let materialSLocPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:StorageLocationLstPkr');
        //let parts = SplitReadLink(context.getValue()[0].ReturnValue);
        //materialSLocPicker.setValue(parts.StorageLocation, false);
    } catch (err) {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(), `PartLibrary.partCreateUpdateOnChange(MaterialLstPkr) error: ${err}`);
    }
}

function resetMaterialUOMValue(context, materialUOMListPicker) {
    if (libCom.getStateVariable(context, 'MaterialUOMLstPkrNoReset')) {
        libCom.removeStateVariable(context, 'MaterialUOMLstPkrNoReset');
    } else {
        materialUOMListPicker.setValue('');
    }
}
