import libCommon from '../Library/CommonLibrary';
import libNotif from '../../Notifications/NotificationLibrary';
import AssignmentType from '../Library/AssignmentType';
import Logger from '../../Log/Logger';
import libS4 from '../../ServiceOrders/S4ServiceLibrary';
export default function ResetFlags(pageProxy) {
    libCommon.setOnCreateUpdateFlag(pageProxy, '');
    libCommon.setOnChangesetFlag(pageProxy, false);
    libCommon.setOnWOChangesetFlag(pageProxy, false);
    libNotif.setAddFromJobFlag(pageProxy, false);
    libNotif.setAddFromMapFlag(pageProxy, false);
    libNotif.setAddFromOperationFlag(pageProxy, false);
    libNotif.setAddFromSuboperationFlag(pageProxy, false);
    libCommon.setStateVariable(pageProxy, 'FromOperationsList', false);
    libCommon.setStateVariable(pageProxy, 'isMinorWork', false);
    libS4.setOnSOChangesetFlag(pageProxy, false);
    libS4.setOnSQChangesetFlag(pageProxy, false);
    libS4.setServiceItemBasicMode(pageProxy);
    libCommon.setStateVariable(pageProxy, 'createdEquipSuperior', '');
    libCommon.setStateVariable(pageProxy, 'createdEquipID', '');
    try {
        AssignmentType.removeWorkOrderDefaultOverride();
    } catch (error) {
        Logger.error('AssigmentType RemoveWorkOrderDeafultOverrride:', error);
    }
    return libCommon.clearDocDataOnClientData(pageProxy);

}
