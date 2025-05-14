import RedrawFilterToolbar from '../../Filter/RedrawFilterToolbar';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function VoyagePADateFilter(context) {
    const pageName = CommonLibrary.getPageName(context);
    const PADateSwitch = context.evaluateTargetPath(`#Page:${pageName}/#Control:PADateSwitch`); 
    const PADateSwitchValue = PADateSwitch.getValue();
    const startDateControl = context.evaluateTargetPath(`#Page:${pageName}/#Control:StartDateFilter`);
    const endDateControl = context.evaluateTargetPath(`#Page:${pageName}/#Control:EndDateFilter`);

    startDateControl.setVisible(PADateSwitchValue);
    endDateControl.setVisible(PADateSwitchValue);

    startDateControl.redraw();
    endDateControl.redraw();

    // persist the date filter values
    let clientData = context.evaluateTargetPath(`#Page:${pageName}/#ClientData`);
    clientData.PADateSwitch = PADateSwitchValue;

    RedrawFilterToolbar(context);
}
