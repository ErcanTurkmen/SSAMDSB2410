/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function InspectionCharacteristicsDescriptionID(clientAPI) {
    return clientAPI.binding.ShortDesc + ' (' + clientAPI.binding.InspectionChar + ')';
}
