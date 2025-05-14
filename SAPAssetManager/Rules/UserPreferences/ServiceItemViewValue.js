import PersonalizationPreferences from './PersonalizationPreferences';

/**
* Get current value of service items view
* @param {IClientAPI} context
*/
export default function ServiceItemViewValue(context) {
    return PersonalizationPreferences.getServiceItemsView(context);
}
