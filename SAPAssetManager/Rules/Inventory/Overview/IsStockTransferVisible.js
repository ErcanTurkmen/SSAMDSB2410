/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function IsStockTransferVisible(clientAPI) {
    return userFeaturesLib.isFeatureEnabled(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/StockTransfer.global').getValue());
}
