/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/

import libCom from '../Common/Library/CommonLibrary';

export default function HRInfoVisibility(clientAPI) {
    return (libCom.getAppParam(clientAPI, 'ABOUT_PAGE', 'UserHRInfo')  === 'Y');
}
