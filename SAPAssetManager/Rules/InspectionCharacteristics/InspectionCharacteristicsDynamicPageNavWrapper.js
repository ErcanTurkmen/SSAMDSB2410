import InspectionCharacteristicsDynamicPageNav from './InspectionCharacteristicsDynamicPageNav';
import InspectionCharacteristicsEDTDynamicPageNav from './InspectionCharacteristicsEDTDynamicPageNav';
import PersonalizationPreferences from '../UserPreferences/PersonalizationPreferences';

export default function InspectionCharacteristicsDynamicPageNavWrapper(context) {
    if (PersonalizationPreferences.isInspectionCharacteristicsListView(context)) {
        return InspectionCharacteristicsDynamicPageNav(context);
    }
    return InspectionCharacteristicsEDTDynamicPageNav(context);
}
