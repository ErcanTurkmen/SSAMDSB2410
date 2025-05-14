import userFeaturesLib from './UserFeaturesLibrary';

export default function IsWCMWorkOrderEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/WCMWorkOrder.global').getValue());
}
