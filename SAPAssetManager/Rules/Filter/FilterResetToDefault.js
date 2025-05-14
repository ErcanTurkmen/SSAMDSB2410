import PersonalizationPreferences from '../UserPreferences/PersonalizationPreferences';
import FilterLibrary from './FilterLibrary';
import FilterSettings from './FilterSettings';


export default function FilterResetToDefault(context) {
    FilterLibrary.filterResetToDefaults(context);
    const filterPageProxy = context.getPageProxy();
    const listPageProxy = filterPageProxy.getFilter().controlProxy.getPageProxy();
    if (PersonalizationPreferences.getPersistFilterPreference(context)) {
        FilterSettings.resetFilters(context, filterPageProxy, listPageProxy);
    }
}
