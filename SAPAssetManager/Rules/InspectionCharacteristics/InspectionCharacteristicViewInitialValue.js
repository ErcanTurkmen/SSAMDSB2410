import PersonalizationPreferences from '../UserPreferences/PersonalizationPreferences';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function InspectionCharacteristicViewInitialValue(clientAPI) {
    return PersonalizationPreferences.getInspectionCharacteristicsView(clientAPI);
}
