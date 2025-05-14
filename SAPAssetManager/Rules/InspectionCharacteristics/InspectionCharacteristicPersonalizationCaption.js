/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function InspectionCharacteristicPersonalizationCaption(clientAPI) {
    return clientAPI.localizeText('checklists') + '/' +  clientAPI.localizeText('record_results');
}
