/**
* Show/Hide Take Reading button based on User Authorization and PM_MEASUREMENT feature
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import Logger from '../../Log/Logger';

export default function EnableMeasurementCreate(context, actionBinding) {
    if (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.MD.Create') === 'Y') {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PRT.global').getValue())) {
            let readLink = actionBinding ? actionBinding['@odata.readLink'] : context.binding['@odata.readLink'];
            return context.read('/SAPAssetManager/Services/AssetManager.service', readLink + '/WorkOrderTool', [], '')
                .then(function(result) {
                    if (result.length > 0 && result.getItem(0)) {
                        return true;
                    }
                    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMMeasurement.global').getValue());
                })
                .catch(function(error) {
                    Logger.error(`EnableMeasurementCreate: ${error}`);
                    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMMeasurement.global').getValue());
                });
        } else if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMMeasurement.global').getValue())) {
            return true;
        }
        return false;
    }
    return false;
}
