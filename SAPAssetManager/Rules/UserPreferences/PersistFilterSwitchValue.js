import PersonalizationPreferences from './PersonalizationPreferences';

export default function PersistFilterSwitchValue(context) {
    return PersonalizationPreferences.getPersistFilterPreference(context);
}
