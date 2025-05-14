import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import libFeature from '../UserFeatures/UserFeaturesLibrary';

/**
* Returns if Online Search is enabled based on user features
* @param {IClientAPI} context
*/
export default function IsOnlineSearchEnabled(context) {
    return libFeature.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/OnlineSearch.global').getValue()) &&
        !IsS4ServiceIntegrationEnabled(context);
}
