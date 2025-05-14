import FilterSettings from '../../Filter/FilterSettings';

export default function ServiceQuotationsOnLoaded(context) {
    FilterSettings.applySavedFilterOnList(context);
}
