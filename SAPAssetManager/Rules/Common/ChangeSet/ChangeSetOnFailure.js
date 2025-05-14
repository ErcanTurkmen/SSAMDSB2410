import libCommon from '../Library/CommonLibrary';
import AssignmentType from '../../Common/Library/AssignmentType';
import Logger from '../../Log/Logger';
import libS4 from '../../ServiceOrders/S4ServiceLibrary';

/**
 * After changeset success, reset the state variables
 */
export default function ChangeSetOnFailure(pageProxy) {
    libCommon.setOnCreateUpdateFlag(pageProxy, '');
    libCommon.setOnChangesetFlag(pageProxy, false);
    libCommon.setOnWOChangesetFlag(pageProxy, false);
    libS4.setOnSOChangesetFlag(pageProxy, false);
    libS4.setOnSRChangesetFlag(pageProxy, false);
    libS4.setServiceItemBasicMode(pageProxy);
    try {
        AssignmentType.removeWorkOrderDefaultOverride();
    } catch (error) {
        Logger.error('AssigmentType RemoveWorkOrderDeafultOverrride: ', error);
    }
}
