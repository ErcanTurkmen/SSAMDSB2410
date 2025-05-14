/**
* @param {IClientAPI} clientAPI
*/
export default function NotificationCreateUpdateEffectPickerValue(clientAPI) {
    return clientAPI.binding?.Effect || '';
}
