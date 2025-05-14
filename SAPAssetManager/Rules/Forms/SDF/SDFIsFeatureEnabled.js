
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

/**
 * Is the Orbeon Forms feature enabled for this user? 
 * @param {*} context
 * @returns {boolean}
 */
export default function SDFIsFeatureEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/SAPDynamicForms.global').getValue());
}
