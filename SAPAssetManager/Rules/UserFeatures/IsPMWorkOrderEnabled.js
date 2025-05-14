/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import UserFeaturesLibrary from './UserFeaturesLibrary';

export default function IsPMWorkOrderEnabled(clientAPI) {
    return UserFeaturesLibrary.isFeatureEnabled(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMWorkOrder.global').getValue());
}
