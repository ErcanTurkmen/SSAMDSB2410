import Logger from '../Log/Logger';
import filterLib from '../Filter/FilterLibrary';
import FilterSettings from './FilterSettings';
import commonLib from '../Common/Library/CommonLibrary';
import PersonalizationPreferences from '../UserPreferences/PersonalizationPreferences';

export default function FilterReset(context) {
    try {
        if (!commonLib.getPageName(context).includes('Online') && PersonalizationPreferences.getPersistFilterPreference(context)) {
            FilterSettings.resetFilters(context, context.getPageProxy(), context.evaluateTargetPathForAPI('#Page:-Previous'));
        }
        filterLib.filterResetToDefaults(context);
    } catch (exception) {
        /**Implementing our Logger class*/
        Logger.error('Filter', `FilterReset error: ${exception}`);
    }
}
