import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';

export default function IsInspectionCharacteristicsFilterSectionCaption(context) {
    return PersonalizationPreferences.isInspectionCharacteristicsListView(context)? '' : context.localizeText('save_data_before_filter_message');
}
