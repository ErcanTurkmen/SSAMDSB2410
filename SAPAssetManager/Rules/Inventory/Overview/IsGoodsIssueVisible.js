/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function IsGoodsIssueVisible(clientAPI) {
    return userFeaturesLib.isFeatureEnabled(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/GoodsIssue.global').getValue());
}
