import libComm from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default function IsAutoSyncNotInProgress(context) {
    try {
        return !(libComm.getStateVariable(context, 'SyncInProgress') && libComm.getStateVariable(context, 'IsAutoSync'));
    } catch (error) {
        Logger.info('IsAutoSyncNotInProgress', error);
        return false;
    }
}
