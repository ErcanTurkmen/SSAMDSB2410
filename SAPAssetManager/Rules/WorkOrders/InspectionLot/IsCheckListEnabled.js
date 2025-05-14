import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import Logger from '../../Log/Logger';
import libCommon from '../../Common/Library/CommonLibrary';

export default async function IsCheckListEnabled(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue())) {
        const binding = context.getPageProxy().binding;
        if (binding.EAMChecklist_Nav) {
            return !!binding.EAMChecklist_Nav.length;
        }

        try {
            const count = await libCommon.getEntitySetCount(context, `${binding['@odata.readLink']}/EAMChecklist_Nav`);
            return count > 0;
        } catch (error) {
            Logger.error('Error in IsCheckListEnabled: ', error);
            return false;
        }
    } else {
        return false;
    }
}
