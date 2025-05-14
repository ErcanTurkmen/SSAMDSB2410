import IsIOS from '../Common/IsIOS';

export default function MDKVersionInfo(clientAPI) {
    if (IsIOS(clientAPI)) {
        return clientAPI.getVersionInfo().SAPMDC;
    } else {
        return clientAPI.getVersionInfo()['MDKClient Version'];
    }
}
