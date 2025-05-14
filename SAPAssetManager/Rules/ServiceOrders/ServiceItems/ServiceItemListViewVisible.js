import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';

/**
* Return visibility of the section based on current service items view preference
* @param {IClientAPI} context
*/
export default function ServiceItemTableViewVisible(context) {
    return PersonalizationPreferences.isServiceItemListView(context);
}
