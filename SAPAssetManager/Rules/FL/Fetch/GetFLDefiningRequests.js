import appSettings from '../../Common/Library/ApplicationSettings';
import libVal from '../../Common/Library/ValidationLibrary';
import { FLDefiningRequestsLite } from '../Common/FLLibrary';
import libCom from '../../Common/Library/CommonLibrary';
/**
* This is used to set defining requests based on documents, that are need to be downloaded
* we're taking document type and put all required entity sets into final array (each one can be put only once)
* @param {*} context
*/

export default function GetFLDefiningRequests(context) {
    let count = appSettings.getNumber(context, 'FLOGEntityCount');
    const downloadLite = (libCom.getAppParam(context, 'FL', 'download.lite') === 'Y');
    let definingRequests = [];
    if (libVal.evalIsNumeric(count)) {
        for (let index = 0; index < count; index++) {
            let entitysetName = appSettings.getString(context, 'FLOGEntity-' + index);
            if (downloadLite) {
                if (FLDefiningRequestsLite.includes(entitysetName)) {
                    definingRequests.push(getDefiningObject(entitysetName));
                }
            } else {
                definingRequests.push(getDefiningObject(entitysetName));
            }
        }
    }
    return definingRequests;
}

function getDefiningObject(localVal, onlineVal) {
    // put local DB name first, then the one from online service
    // if they are same, they it supported to push onle first value
    return {
        'Name': localVal,
        'Query': onlineVal || localVal,
    };
}
