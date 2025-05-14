import enableEquipmentInstall from '../../UserAuthorizations/FunctionalLocations/EnableFunctionalLocationEdit';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import UserFeaturesLibrary from '../../UserFeatures/UserFeaturesLibrary';

export default function EquipmentInstallationVisible(context) {
    if (PersonaLibrary.isWCMOperator(context)) {
        return false;
    }

    if (!UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Dismantle.global').getValue())) {
        return false;
    }

    if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        if (context.binding.EquipAllowed === '') {
            return false;
        }
        if (context.binding.SingleInstall === 'X') {
            return context.count('/SAPAssetManager/Services/AssetManager.service',context.binding['@odata.readLink']+'/Equipments', '').then(count => {
                if (count < 1) {
                    return enableEquipmentInstall(context);
                }
                return false;
            });
        }
    }
    return enableEquipmentInstall(context);
}
