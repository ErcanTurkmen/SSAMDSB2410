import RedrawFilterToolbar from '../Filter/RedrawFilterToolbar';
import CommonLibrary from '../Common/Library/CommonLibrary';

export default function WorkOrderRequestStartDateFilter(context) {
    const pageName = CommonLibrary.getCurrentPageName(context);
    if (!pageName) return;

    let reqDateSwitch = context.evaluateTargetPath(`#Page:${pageName}/#Control:RequestStartDateSwitch`);
    let switchValue = reqDateSwitch.getValue();

    let startDateControl = context.evaluateTargetPath(`#Page:${pageName}/#Control:ReqStartDateFilter`);
    let endDateControl = context.evaluateTargetPath(`#Page:${pageName}/#Control:ReqEndDateFilter`);
    startDateControl.setVisible(switchValue);
    endDateControl.setVisible(switchValue);

    let parentPageName = 'WorkOrdersListViewPage';
    if (pageName === 'ServiceOrderFilterPage') {
        parentPageName = 'ServiceOrdersListViewPage';
    }
    if (pageName === 'ServiceRequestFilterPage') {
        parentPageName = 'ServiceRequestsListViewPage';
    }
    // persist the date filter values
    let clientData = context.evaluateTargetPath(`#Page:${parentPageName}/#ClientData`);
    clientData.reqDateSwitch = switchValue;

    RedrawFilterToolbar(context);
}
