import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger'; 

//Upgraded to 2210
export default function UpdateOnlineQueryOptions(context) {

    let pageName = libCom.getPageName(context);
    // Get values from controls
    let materialNumber = context.getPageProxy().evaluateTargetPath('#Control:MaterialNumber').getValue();
    let onlineSwitchValue = context.getPageProxy().evaluateTargetPath('#Control:OnlineSwitch').getValue();

    // Get target specifier
    let materialListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:MaterialLstPkr');
    let materialLstPkrSpecifier = materialListPicker.getTargetSpecifier();
    materialListPicker.setValue('');
    if(pageName=== "ZPartAdhocIssueCreateUpdate" || pageName=== "ZPartAdhocReturnCreateUpdate")
    {
        materialListPicker.setEditable(true);
    }

    // DSB Customisation - changed title. removed desc and added in Subhead. Added Material Num as title
    if (onlineSwitchValue) {
        materialLstPkrSpecifier.setObjectCell({
            'PreserveIconStackSpacing': false,
            'Title': '{{#Property:MaterialNum}}',
            'Subhead': '{{#Property:MaterialDesc}}',
            'Footnote' : '/ZDSBSSAM/Rules/Parts/CreateUpdate/ZOnlinePlantValue.js',
        });
    } else {
        materialLstPkrSpecifier.setObjectCell({
            'PreserveIconStackSpacing': false,
            'Title': '{{#Property:Material/#Property:Description}} ({{#Property:MaterialNum}})',
            'Subhead': '/SAPAssetManager/Rules/Parts/CreateUpdate/PlantValue.js',
            'Footnote' : '{{#Property:Material/#Property:BaseUOM}}',
        });
    }
    materialLstPkrSpecifier.setEntitySet('MaterialSLocs');
    materialLstPkrSpecifier.setReturnValue('{@odata.readLink}');
//    materialLstPkrSpecifier.setQueryOptions(materialLstPkrQueryOptions);
    if (onlineSwitchValue) {
        materialLstPkrSpecifier.setService('/SAPAssetManager/Services/OnlineAssetManager.service');
    } else {
        materialLstPkrSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
    }
    return materialListPicker.setTargetSpecifier(materialLstPkrSpecifier, false).then(() => {
        if (materialNumber && context.getPageProxy().binding.Plant && context.getPageProxy().binding.StorageLocation) {
            return materialListPicker.setValue(`MaterialSLocs(Plant='${context.getPageProxy().binding.Plant}',StorageLocation='${context.getPageProxy().binding.StorageLocation}',MaterialNum='${materialNumber}')`);
        } else {
            return materialListPicker.setValue('');
        }
    }).catch(() => {
        // Could not set specifier
        return materialListPicker.setValue('');
    });

}
