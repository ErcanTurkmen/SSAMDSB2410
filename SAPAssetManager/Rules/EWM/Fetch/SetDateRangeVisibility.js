/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SetDateRangeVisibility(context) {
    const page = 'EWMFetchDocumentsPage';
    const DateRangeSwitch = context.evaluateTargetPath(`#Page:${page}/#Control:DateRangeSwitch`);
    const startDate = context.evaluateTargetPath(`#Page:${page}/#Control:StartDate`);
    const endDate = context.evaluateTargetPath(`#Page:${page}/#Control:EndDate`);

    const visibilityValue = DateRangeSwitch.getValue();
    startDate.setVisible(visibilityValue);
    endDate.setVisible(visibilityValue);

    startDate.redraw();
    endDate.redraw();
}
