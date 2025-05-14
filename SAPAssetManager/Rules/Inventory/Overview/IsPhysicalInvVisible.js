/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function IsPhysicalInvVisible(clientAPI) {
    return userFeaturesLib.isFeatureEnabled(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/PhysicalInventory.global').getValue());
}
