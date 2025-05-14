import CommonLibrary from '../Common/Library/CommonLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import Logger from '../Log/Logger';
import PersonalizationPreferences from '../UserPreferences/PersonalizationPreferences';
import FilterLibrary from './FilterLibrary';
import FilterSettings from './FilterSettings';

export default async function ResetFilterEnabled(/** @type {IFioriToolbarItemButtonControlProxy} */ context) {
    try {
        const pageProxy = context.getPageProxy();
        const isFilterPersistEnabled = PersonalizationPreferences.getPersistFilterPreference(context);
        return isFilterPersistEnabled ? await hasSavedFilter(context, FilterSettings.getPreferenceName(pageProxy)) : (0 < FilterLibrary.getFilterCount(pageProxy));
    } catch (err) {
        Logger.error('Reset filter button', `ResetFilterEnabled error: ${err}`);
        return false;
    }
}

function hasSavedFilter(context, preferenceName) {
    return FilterSettings.readFilterSettingsByPreferenceName(context, preferenceName)
        .then(savedFilter => savedFilter && FilterSettings.parseFilterCriteriaString(context, savedFilter.PreferenceValue))
        .then(parsedFilterCriteria => parsedFilterCriteria?.filter(c => CommonLibrary.isDefined(c.filterItems)))
        .then(parsedFilterCriteria => !ValidationLibrary.evalIsEmpty(parsedFilterCriteria))
        .catch(() => false);
}
