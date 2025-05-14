/**
* Comparison of start date and end date with
* calling of error dialog in case of error
* @param {IClientAPI} context
* @param {Date} dueDate
* @param {Date} startDate
* @param {Date} endDate
* @param {boolean} checkStartDateInFuture
*/
export default function CompareStartEndDate(context, dueDate, startDate, endDate, checkStartDateInFuture = true) {
    if (dueDate) {
        if (startDate > endDate) {
            context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
                'Properties': {
                    'Message': context.localizeText('from_greater_to'),
                },
            });
            return Promise.resolve();
        } else if (checkStartDateInFuture && startDate > new Date()) {
            context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
                'Properties': {
                    'Message': context.localizeText('from_in_future'),
                },
            });
        }
    }
    return Promise.resolve();
}
