/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import isAndroid from '../../Common/IsAndroid';
import libCom from '../../Common/Library/CommonLibrary';
export default function ShowResourceIcon(context) {
    if (context.binding.User !== '' && libCom.getSapUserName(context) !== context.binding.User) {
        return '';
    } else {
        const releaseIcon = isAndroid(context) ? '/SAPAssetManager/Images/release.android.png' : '/SAPAssetManager/Images/release.ios.png';
        const claimIcon = isAndroid(context) ? '/SAPAssetManager/Images/claim.android.png' : '/SAPAssetManager/Images/claim.ios.png';
        return context.binding.User ? releaseIcon : claimIcon;
    }
}

