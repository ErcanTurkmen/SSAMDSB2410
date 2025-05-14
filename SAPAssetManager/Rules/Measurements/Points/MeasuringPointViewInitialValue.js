import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function MeasuringPointViewInitialValue(clientAPI) {
    return PersonalizationPreferences.getMeasuringPointView(clientAPI);
}
