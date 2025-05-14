import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function IsPurchaseRequisitionEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PurchaseRequisition.global').getValue());
}
