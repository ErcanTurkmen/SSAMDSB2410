export default function InitialStatusPickerValue(context) {
    let clientData = context.evaluateTargetPath('#Page:S4ConfirmationsListViewPage/#ClientData');
    let statusLstPickerValues = clientData.statusLstPickerValues;
    if (!statusLstPickerValues) {
        statusLstPickerValues = [];
    }
    return statusLstPickerValues;
}
