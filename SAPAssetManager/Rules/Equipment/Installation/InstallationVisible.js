import EnableEquipmentEdit from '../../UserAuthorizations/Equipments/EnableEquipmentEdit';
import UserFeaturesLibrary from '../../UserFeatures/UserFeaturesLibrary';

export default function InstallationVisible(context) {
    if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Dismantle.global').getValue())) {  
        return EnableEquipmentEdit(context);
    } else {
        return false;
    }
}
