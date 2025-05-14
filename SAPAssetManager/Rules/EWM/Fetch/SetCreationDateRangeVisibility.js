/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SetCreationDateRangeVisibility(context) {
    const page = 'EWMFetchDocumentsPage';
    const DateRangeSwitch = context.evaluateTargetPath(`#Page:${page}/#Control:CreationDateRangeSwitch`);
    const startDate = context.evaluateTargetPath(`#Page:${page}/#Control:CreationStartDate`);
    const endDate = context.evaluateTargetPath(`#Page:${page}/#Control:CreationEndDate`);

    const visibilityValue = DateRangeSwitch.getValue();
    startDate.setVisible(visibilityValue);
    endDate.setVisible(visibilityValue);

    startDate.redraw();
    endDate.redraw();
}
