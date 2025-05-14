import ChangeSetOnSuccess from '../../Common/ChangeSet/ChangeSetOnSuccess';
import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';
import Logger from '../../Log/Logger';

export default function SetConfirmationStatuses(context) {
    return ServiceConfirmationLibrary.getInstance().setConfirmationOpenStatus(context)
        .then(() => {
            return ServiceConfirmationLibrary.getInstance().setConfirmationItemOpenStatus(context);
        }).then(() => {
            return ChangeSetOnSuccess(context);
        }).catch(error => {
            Logger.error('Set confirmation status ', error);
        });
}
