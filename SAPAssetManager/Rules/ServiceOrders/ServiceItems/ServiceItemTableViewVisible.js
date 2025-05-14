import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';

/**
* Return visibility of the section based on current service items biew preference
* @param {IClientAPI} context
*/
export default function ServiceItemTableViewVisible(context) {
    return PersonalizationPreferences.isServiceItemTableView(context);
}
