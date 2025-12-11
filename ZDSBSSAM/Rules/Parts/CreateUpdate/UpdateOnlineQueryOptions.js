import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import CheckForConnectivity from '../../../../SAPAssetManager/Rules/Common/CheckForConnectivity';

//Upgraded to 2210
export default function UpdateOnlineQueryOptions(context) {
    const onCreate = libCom.IsOnCreate(context);
    let pageName = libCom.getPageName(context);
    // Get values from controls
    let materialNumber = context.getPageProxy().evaluateTargetPath('#Control:MaterialNumber').getValue();
    let onlineSwitchValue = context.getPageProxy().evaluateTargetPath('#Control:OnlineSwitch').getValue();

    // Get target specifier
    let materialListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:MaterialLstPkr');
    let materialLstPkrSpecifier = materialListPicker.getTargetSpecifier();
    if (onCreate) {
        materialListPicker.setValue('');
    }
    if (pageName === "ZPartAdhocIssueCreateUpdate" || pageName === "ZPartAdhocReturnCreateUpdate") {
        materialListPicker.setEditable(true);
    }

    // DSB Customisation - changed title. removed desc and added in Subhead. Added Material Num as title
    try {
        if (onlineSwitchValue && CheckForConnectivity(context)) {
            materialLstPkrSpecifier.setObjectCell({
                'PreserveIconStackSpacing': false,
                'Title': '{{#Property:MaterialNum}}',
                'Subhead': '{{#Property:MaterialDesc}}',
                'Footnote': '/ZDSBSSAM/Rules/Parts/CreateUpdate/ZOnlinePlantValue.js',
            });
            materialLstPkrSpecifier.setService('/SAPAssetManager/Services/OnlineAssetManager.service');
        } else {
            materialLstPkrSpecifier.setObjectCell({
                'PreserveIconStackSpacing': false,
                'Title': '{{#Property:Material/#Property:Description}} ({{#Property:MaterialNum}})',
                'Subhead': '/SAPAssetManager/Rules/Parts/CreateUpdate/PlantValue.js',
                'Footnote': '{{#Property:Material/#Property:BaseUOM}}',
            });
            materialLstPkrSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        }
        materialLstPkrSpecifier.setEntitySet('MaterialSLocs');
        materialLstPkrSpecifier.setReturnValue('{@odata.readLink}');
        return materialListPicker.setTargetSpecifier(materialLstPkrSpecifier, false).then(() => {
            let plant = '';
            if (context.getPageProxy().binding['@odata.type'] === "#sap_mobile.MyWorkOrderHeader") {
                plant = context.getPageProxy().binding.MaintenancePlant;
            }
            else {
                plant = context.getPageProxy().binding.WOHeader.MaintenancePlant;
            }
            if (materialNumber && plant && context.getPageProxy().binding.StorageLocation) {
                return materialListPicker.setValue(`MaterialSLocs(Plant='${plant}',StorageLocation='${context.getPageProxy().binding.StorageLocation}',MaterialNum='${materialNumber}')`);
            } else {
                return materialListPicker.setValue('');
            }
        }).catch(() => {
            // Could not set specifier
            return materialListPicker.setValue('');
        });
    }
    catch (error) {
        // Could not init online service
        Logger.error(`Failed to initialize Online OData Service: ${error}`);
        return context.executeAction('/SAPAssetManager/Actions/SyncErrorBannerMessage.action');
    }
}
