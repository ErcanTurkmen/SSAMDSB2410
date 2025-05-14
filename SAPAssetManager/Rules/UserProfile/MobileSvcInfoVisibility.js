/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import libCom from '../Common/Library/CommonLibrary';

export default function MobileSvcInfoVisibility(clientAPI) {
    return (libCom.getAppParam(clientAPI, 'ABOUT_PAGE', 'MobileServiceInfo')  === 'Y');
}
