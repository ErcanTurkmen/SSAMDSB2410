
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsGeometryEditAllowed(context) {
    return userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GISAddEdit.global').getValue()) &&
            userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GIS.global').getValue());
}
