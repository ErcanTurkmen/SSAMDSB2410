import SaveFilterAsDefault from '../../Filter/SaveFilterAsDefault';
import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';

export default async function WCMFilterApply(context) {
    if (PersonalizationPreferences.getPersistFilterPreference(context)) {
        await SaveFilterAsDefault(context);
    }
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
}
