
import CommonLibrary from '../Common/Library/CommonLibrary';
import FilterReset from '../Filter/FilterReset';
import phaseFilterReset from '../PhaseModel/PhaseModelFilterPickerReset';

export default function NotificationListFilterReset(context) {
    phaseFilterReset(context, 'PhaseFilter');

    let clientData = context.evaluateTargetPath('#Page:NotificationsListViewPage/#ClientData');

    if (clientData && clientData.creationDateSwitch !== undefined) {
        clientData.creationDateSwitch = undefined;
        clientData.startDate = '';
        clientData.endDate = '';
    }

    const previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    CommonLibrary.removeStateVariable(context, 'filterCount', CommonLibrary.getPageName(previousPage));

    FilterReset(context);
}
