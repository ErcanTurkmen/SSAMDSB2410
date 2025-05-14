import IsWindows from './IsWindows';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function IsFlexibleSpaceVisible(clientAPI) {
    return !IsWindows(clientAPI);
}
