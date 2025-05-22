import Logger from '../../../../../SAPAssetManager/Rules/Log/Logger';
import libCom from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import EnableMultipleTechnician from '../../../../../SAPAssetManager/Rules/SideDrawer/EnableMultipleTechnician';
import {SplitReadLink} from '../../../../../SAPAssetManager/Rules/Common/Library/ReadLinkUtils';
import SetAvailableQuantity from '../../../../../SAPAssetManager/Rules/Parts/CreateUpdate/SetAvailableQuantity';
import IsSerialPartsAreAllowed from '../SerialParts/ZAdhocPartsIssueSerialPartsAreAllowed';
import ResetValidationOnInput from '../../../../../SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput';


export default function ZPartAdhocIssueSetUOMAndSerialNo(context) {
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
            let returnValue = context.getValue()[0].ReturnValue; //material read link
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
                    materialUOMListPicker.setTargetSpecifier(materialUOMLstPkrSpecifier);
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

            
                //Code to set serial no
                /*let querySerial = onlineSwitch 
                ? `$filter=Plant eq '${readLinkData.Plant}' and MaterialNum eq '${readLinkData.MaterialNum}'`
                : '';*/
                context.read(service, 'MaterialPlants', [], `$filter=Plant eq '${readLinkData.Plant}' and MaterialNum eq '${readLinkData.MaterialNum}'`).then(result => {
                    if (result && result.getItem(0)) {
                        let materialRow = result.getItem(0);
                        let isSerial=materialRow.SerialNumberProfile;
                            if(isSerial){ 
                                let serialNumListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:SerialNumLstPkr');
                                let serialNumLstPkrSpecifier = serialNumListPicker.getTargetSpecifier();
                                let entitySet = returnValue+ '/Material/SerialNumbers';
                                serialNumLstPkrSpecifier.setEntitySet(entitySet);
                                //serialNumLstPkrSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                                serialNumLstPkrSpecifier.setReturnValue('{SerialNumber}');
                                serialNumLstPkrSpecifier.setObjectCell({
                                    'Title': '{SerialNumber}',
                                });
                                let queryOptions = "$expand=Material&$orderby=SerialNumber&$filter=Issued eq ''";
                                
                                if (readLinkData.StorageLocation) {
                                    queryOptions = queryOptions + " and StorageLocation eq '" + readLinkData.StorageLocation + "'";
                                }
                                serialNumLstPkrSpecifier.setQueryOptions(queryOptions);
                                serialNumListPicker.setTargetSpecifier(serialNumLstPkrSpecifier);
                                serialNumListPicker.setVisible(true);

                                //set for autoserial switch - DSB customisation to not set this true. Auto serial no not valid for DSB
                                //let autoGenerateSerialNumberSwitch = context.getPageProxy().evaluateTargetPathForAPI('#Control:AutoGenerateSerialNumberSwitch');
                                //autoGenerateSerialNumberSwitch.setVisible(true);
                            }
                            else
                            {
                                let serialNumListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:SerialNumLstPkr');
                                serialNumListPicker.setVisible(false);
                                serialNumListPicker.setValue("");
                                let autoGenerateSerialNumberSwitch = context.getPageProxy().evaluateTargetPathForAPI('#Control:AutoGenerateSerialNumberSwitch');
                                autoGenerateSerialNumberSwitch.setVisible(false);
                                autoGenerateSerialNumberSwitch.setValue(false);
                            }
                        
                        /*let isValCat=materialRow.ValuationCategory;
                       
                            if(isValCat){ 
                                let valuationTypePicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:ValuationTypePicker');
                                let valuationTypePkrSpecifier = valuationTypePicker.getTargetSpecifier();
                                let entitySet = returnValue+ '/Material/MaterialValuation_Nav';
                                valuationTypePkrSpecifier.setEntitySet(entitySet);
                                valuationTypePkrSpecifier.setReturnValue('{ValuationType}');
                                valuationTypePkrSpecifier.setObjectCell({
                                    'Title': '{ValuationType}',
                                });
                                let queryOptions = "$orderby=ValuationType";
                              
                                valuationTypePkrSpecifier.setQueryOptions(queryOptions);
                                valuationTypePicker.setTargetSpecifier(valuationTypePkrSpecifier);
                                valuationTypePicker.setVisible(true);
                            }
                            else
                            {
                                let valuationTypePicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:ValuationTypePicker');
                                valuationTypePicker.setVisible(false);
                                valuationTypePicker.setValue("");
                            }
                        */

                    }
                });
                    

        } else {
            materialUOMs = 'MaterialUOMs';
            materialUOMLstPkrQueryOptions += '&$filter=MaterialNum eq \'\'';
            materialUOMLstPkrSpecifier.setQueryOptions(materialUOMLstPkrQueryOptions);
            materialUOMListPicker.setTargetSpecifier(materialUOMLstPkrSpecifier);
            materialUOMLstPkrSpecifier.setEntitySet(materialUOMs);
            if (batchListPicker) {
                batchListPicker.setVisible(false);
            }
        }
        
        // if (context.getPageProxy().evaluateTargetPathForAPI('#Control:OnlineSwitch').getValue()) {
            //     //materialUOMLstPkrSpecifier.setService('/SAPAssetManager/Services/OnlineAssetManager.service');
            // }
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
