import ResetValidationOnInput from '../../../../../../SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput';


export default function ZPRTEquipmentOnlineQueryOptions(context) {
    ResetValidationOnInput(context);
    // Get values from controls
    let equiID = context.getPageProxy().evaluateTargetPath('#Control:EquipmentNumber').getValue();

    // Get target specifier
    let equipmentListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:EquipmentLstPkr');
    let equipmentLstPkrSpecifier = equipmentListPicker.getTargetSpecifier();
    equipmentListPicker.setValue('');
    equipmentLstPkrSpecifier.setEntitySet('Equipments');
    equipmentLstPkrSpecifier.setService('/SAPAssetManager/Services/OnlineAssetManager.service');
    return equipmentListPicker.setTargetSpecifier(equipmentLstPkrSpecifier,false).then(() => {
        return equipmentListPicker.setValue('');
    }).catch(() => {
        // Could not set specifier
        return materialListPicker.setValue('');
    });
}
