import libCom from '../../Common/Library/CommonLibrary';

/**
* Checks if technician is allowed to enter time for another technician
* @param {IClientAPI} context
*/
export default function IsAnotherTechnicianSelectEnabled(context) {
    return libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.TimeEntryForOthers') === 'Y';
}
