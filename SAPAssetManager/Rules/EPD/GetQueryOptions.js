/**
* Describe this function...
* @param {IClientAPI} context
*/
import libComm from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default function GetQueryOptions(context) {
    let equip_usageId = libComm.getAppParam(context, 'EPD_USAGE', 'USAGE_IEQ');
    let floc_usageId = libComm.getAppParam(context, 'EPD_USAGE', 'USAGE_IFL');
    let mat_usageId = libComm.getAppParam(context, 'EPD_USAGE', 'USAGE_MAT');

    let path =  "/contents?$filter=usages/any(u:u/name eq '" + equip_usageId + "')" +
                " or usages/any(u:u/name eq '" + floc_usageId + "')" +
                " or usages/any(u:u/name eq '" + mat_usageId + "')";
    Logger.debug('EPD', 'GetQueryOptions: ' + path);
    return path;
}
