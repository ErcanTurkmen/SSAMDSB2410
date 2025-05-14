/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SwitchResourceMessage(clientAPI) {
    const data = clientAPI.actionResults.result.data;
    const response = JSON.parse(data);
    return response?.User === '' ? clientAPI.localizeText('release_successful') : clientAPI.localizeText('claim_successful');
}
