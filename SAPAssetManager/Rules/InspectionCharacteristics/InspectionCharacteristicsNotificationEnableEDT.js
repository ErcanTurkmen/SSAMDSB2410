/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function InspectionCharacteristicsNotificationEnableEDT(clientAPI) {
    return clientAPI.binding.Valuation !== 'R';
}
