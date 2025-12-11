import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import ConfirmationsIsEnabled from '../../../../SAPAssetManager/Rules/Confirmations/ConfirmationsIsEnabled';
import GenerateLocalConfirmationNum from '../../../../SAPAssetManager/Rules/Confirmations/CreateUpdate/OnCommit/GenerateLocalConfirmationNum';
import SupervisorLibrary from '../../../../SAPAssetManager/Rules/Supervisor/SupervisorLibrary';
import TimeSheetCreateUpdatePersonnelNumber from '../../../../SAPAssetManager/Rules/TimeSheets/CreateUpdate/TimeSheetCreateUpdatePersonnelNumber';
import getMinuteInterval from '../../../../SAPAssetManager/Rules/TimeSheets/Entry/CreateUpdate/TimeSheetEntryMinuteInterval';
import getCATSMinuteIntervalDecimal from '../../../../SAPAssetManager/Rules/TimeSheets/Entry/CreateUpdate/TimeSheetEntryMinuteIntervalDecimal';
import GenerateTimeEntryID from '../../../../SAPAssetManager/Rules/TimeSheets/GenerateTimeEntryID';
import TimeSheetsIsEnabled from '../../../../SAPAssetManager/Rules/TimeSheets/TimeSheetsIsEnabled';
import IsOperationLevelAssigmentType from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/IsOperationLevelAssigmentType';
import GenerateConfirmationCounter from '../../../../SAPAssetManager/Rules/Confirmations/CreateUpdate/OnCommit/GenerateConfirmationCounter';
import ODataDate from '../../../../SAPAssetManager/Rules/Common/Date/ODataDate';

export default function WorkOrderOperationsConfirmNav(context) {
    context.getPageProxy().showActivityIndicator();
    libCommon.setStateVariable(context, 'OperationsToConfirm', []);
    const selectedOperations = libCommon.getStateVariable(context, 'selectedOperations');
    const removedOperations = libCommon.getStateVariable(context, 'removedOperations');
    const persNum = TimeSheetCreateUpdatePersonnelNumber(context);
    const isSelectAll = libCommon.getStateVariable(context, 'selectAllActive', 'WorkOrderOperationsListViewPage');
    if (selectedOperations.length === 0) {
        context.getPageProxy().dismissActivityIndicator();
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsNoSelectedMessage.action');
    }
    return Promise.all(getConfirmationsDataPromises(context, selectedOperations, persNum)).then(() => {
        let actionBinding = {
            selectedOperations,
        };
        if (isSelectAll) {
            libCommon.setStateVariable(context, 'OperationsToRemove', [...removedOperations]);
        }
        context.getPageProxy().setActionBinding(actionBinding);
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsConfirmNav.action');
    }).finally(() => {
        context.getPageProxy().dismissActivityIndicator();
    });
}

function getConfirmationsDataPromises(context, selectedOperations, persNum) {
    const isTimesheetEnabled = !ConfirmationsIsEnabled(context) && TimeSheetsIsEnabled(context);
    return selectedOperations.map((selectedContext, i) => {
        return SupervisorLibrary.checkReviewRequired(context, selectedContext.binding).then(isReviewRequired => {
            isReviewRequired = isReviewRequired && IsOperationLevelAssigmentType(context);
            let keyGenerationAction;
            if (isTimesheetEnabled) {
                keyGenerationAction = GenerateTimeEntryID(context, i);
            } else {
                keyGenerationAction = GenerateLocalConfirmationNum(context, i);
            }

            return keyGenerationAction.then(async (key) => {
                let binding = selectedContext.binding;
                let odataDate = new ODataDate();
                let date = new Date();
                let odataCreatedDate = new ODataDate(date);

                let confirmCreateProperties = {
                    ...binding,
                    OperationReadlink: binding['@odata.readLink'],
                    ConfirmationNum: key,
                    SubOperation: binding.SubOperation || '',
                    ConfirmationCounter: await GenerateConfirmationCounter(context, binding),
                    FinalConfirmation: 'X',
                    OrderID: binding.OrderId,
                    Operation: binding.OperationNo,
                    CompleteFlag: '',
                    StartDate: odataDate.toDBDateString(context),
                    StartTime: odataDate.toDBTimeString(context),
                    FinishDate: odataDate.toDBDateString(context),
                    FinishTime: odataDate.toDBTimeString(context),
                    PostingDate: odataDate.toDBDateString(context),
                    CreatedDate: odataCreatedDate.toDBDateString(context),
                    CreatedTime: odataCreatedDate.toDBTimeString(context)
                };
                let operationsToConfirm = libCommon.getStateVariable(context, 'OperationsToConfirm') || [];
                operationsToConfirm.push({
                    ...confirmCreateProperties,
                    WorkOrderHeader: binding.WOHeader,
                });
                libCommon.setStateVariable(context, 'OperationsToConfirm', operationsToConfirm);
            });
        });
    });
}

function calculateDuration(context, clockTime) {
    let interval = getMinuteInterval(context);
    let elapsed = 0;

    if (clockTime > 0) {
        elapsed = clockTime; //Clock In/Out records were found for this business object
    }

    // small number to determine if enough time has passed to set control
    let epsilon = 1 / 7200;
    // Time interval to be used in Duration picker.
    // Set duration to time rounded to closest interval in minutes expressed in Hours
    if (elapsed > epsilon) {
        let duration = (interval) * (Math.round(elapsed / interval));
        if (duration > interval) {
            return duration;
        }
    }

    return interval;
}
