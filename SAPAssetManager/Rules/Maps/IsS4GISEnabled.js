import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function IsS4GISEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GIS.global').getValue()) 
        && IsS4ServiceIntegrationEnabled(context);
}
