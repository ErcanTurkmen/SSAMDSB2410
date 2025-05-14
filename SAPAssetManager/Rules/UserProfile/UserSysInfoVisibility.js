/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import libCom from '../Common/Library/CommonLibrary';

export default function UserSysInfoVisibility(clientAPI) {
    return (libCom.getAppParam(clientAPI, 'ABOUT_PAGE', 'UserSystemInfo')  === 'Y');
}
