/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import libCom from '../../Common/Library/CommonLibrary';
import libEval from '../../Common/Library/ValidationLibrary';
export default function GetClaimedBy(clientAPI) {
    const userName = clientAPI.binding.User;
    if (userName) {
        if (userName === libCom.getSapUserName(clientAPI)) {
            return clientAPI.localizeText('claimed_by_x_x', [clientAPI.localizeText('me'), userName]);
        } else {
            return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'SAPUsers', [], `$filter=UserId eq '${userName}'`).then(usernames => {
                if (!libEval.evalIsEmpty(usernames)) {
                    return clientAPI.localizeText('claimed_by_x_x', [usernames.getItem(0).UserName, userName]);
                }
                return clientAPI.localizeText('claimed_by_x_x', ['', userName]);
            });
        }
    }
    return clientAPI.localizeText('available');
}
