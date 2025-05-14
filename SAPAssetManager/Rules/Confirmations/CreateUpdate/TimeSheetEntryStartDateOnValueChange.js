/**
* Adjust the Posting Date value based on the start date change
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';

export default function TimeSheetEntryStartDateOnValueChange(context) {
    ResetValidationOnInput(context);
    let pageProxy = context.getPageProxy();
    const startDatePickerControl = libCom.getControlProxy(pageProxy, 'HourEndDtPicker');
    const startDateTime = startDatePickerControl.getValue();

    const nowDateTime = new Date();

    if (startDateTime > nowDateTime) {
        return libCom.executeInlineControlError(context, startDatePickerControl, context.localizeText('labor_time_err_start_datetime'));
    }

    startDatePickerControl.clearValidation();
}
