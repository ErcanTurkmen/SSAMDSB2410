import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function IsCSGISEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GIS.global').getValue()) 
        && !IsS4ServiceIntegrationEnabled(context);
}
