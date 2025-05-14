import IsAndroid from '../Common/IsAndroid';
/**
* Returns the AccessoryType based on the platform ...
* @param {IClientAPI} clientAPI
*/
export default function GetAccessoryType(clientAPI) {
    return IsAndroid(clientAPI) ? 'detailButton' : 'none';
}
