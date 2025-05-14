import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import isDefenseEnabled from '../../Defense/isDefenseEnabled';

export default function UpdateOnlineQueryOptions(context) {
    ResetValidationOnInput(context);
    // Get values from controls
    let materialNumber = context.getPageProxy().evaluateTargetPath('#Control:MaterialNumber').getValue();
    let onlineSwitchValue = context.getPageProxy().evaluateTargetPath('#Control:OnlineSwitch').getValue();
    let mpn = context.getPageProxy().evaluateTargetPath('#Control:MaterialMPNStockNumber').getValue();
    let lmpn = context.getPageProxy().evaluateTargetPath('#Control:MaterialLMPNStockNumber').getValue();
    let nato = context.getPageProxy().evaluateTargetPath('#Control:MaterialNatoStockNumber').getValue();

    // Get target specifier
    let materialListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:MaterialLstPkr');
    let materialLstPkrSpecifier = materialListPicker.getTargetSpecifier();
    materialListPicker.setValue('');

    if (onlineSwitchValue) {
        materialLstPkrSpecifier.setObjectCell({
            'PreserveIconStackSpacing': false,
            'Title': '{{#Property:MaterialDesc}} ({{#Property:MaterialNum}})',
            'Subhead': '/SAPAssetManager/Rules/Parts/CreateUpdate/PlantValue.js',
            'Footnote' : '$(L,available_qty_x_x, {UnrestrictedQuantity}, {Material/BaseUOM})',
            'Description': '/SAPAssetManager/Rules/Parts/CreateUpdate/MaterialLstPkrDescription.js',
        });
    } else {
        materialLstPkrSpecifier.setObjectCell({
            'PreserveIconStackSpacing': false,
            'Title': '{{#Property:Material/#Property:Description}} ({{#Property:MaterialNum}})',
            'Subhead': '/SAPAssetManager/Rules/Parts/CreateUpdate/PlantValue.js',
            'Footnote' : '{{#Property:Material/#Property:BaseUOM}}',
            'Description': '/SAPAssetManager/Rules/Parts/CreateUpdate/MaterialLstPkrDescription.js',
        });
    }
    materialLstPkrSpecifier.setEntitySet('MaterialSLocs');
    materialLstPkrSpecifier.setReturnValue('{@odata.readLink}');
    if (onlineSwitchValue) {
        materialLstPkrSpecifier.setService('/SAPAssetManager/Services/OnlineAssetManager.service');
    } else {
        materialLstPkrSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
    }
    return materialListPicker.setTargetSpecifier(materialLstPkrSpecifier, false).then(() => {
        if (materialNumber && context.getPageProxy().binding.Plant && context.getPageProxy().binding.StorageLocation) {
            if (isDefenseEnabled(context)) {
                if (mpn) {
                    return materialListPicker.setValue(`MaterialSLocs(Plant='${context.getPageProxy().binding.Plant}',StorageLocation='${context.getPageProxy().binding.StorageLocation}',MaterialNum='${materialNumber}',ManufacturerPartNum='${mpn}')`);
                } else if (lmpn) {
                    return materialListPicker.setValue(`MaterialSLocs(Plant='${context.getPageProxy().binding.Plant}',StorageLocation='${context.getPageProxy().binding.StorageLocation}',MaterialNum='${materialNumber}',LMPN='${lmpn}')`);
                } else if (nato) {
                    return materialListPicker.setValue(`MaterialSLocs(Plant='${context.getPageProxy().binding.Plant}',StorageLocation='${context.getPageProxy().binding.StorageLocation}',MaterialNum='${materialNumber}',Material/NATOStockNum='${nato}')`);
                } else {
                    return materialListPicker.setValue(`MaterialSLocs(Plant='${context.getPageProxy().binding.Plant}',StorageLocation='${context.getPageProxy().binding.StorageLocation}',MaterialNum='${materialNumber}')`);
                }
            }
            return materialListPicker.setValue(`MaterialSLocs(Plant='${context.getPageProxy().binding.Plant}',StorageLocation='${context.getPageProxy().binding.StorageLocation}',MaterialNum='${materialNumber}')`);
        } else {
            return materialListPicker.setValue('');
        }
    }).catch(() => {
        // Could not set specifier
        return materialListPicker.setValue('');
    });
}
