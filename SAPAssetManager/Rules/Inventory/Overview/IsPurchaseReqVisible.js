/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function IsPurchaseReqVisible(clientAPI) {
    return userFeaturesLib.isFeatureEnabled(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/PurchaseRequisition.global').getValue());  
}
