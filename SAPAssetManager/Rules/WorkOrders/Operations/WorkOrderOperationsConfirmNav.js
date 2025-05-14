import ClockInClockOutLibrary from '../../ClockInClockOut/ClockInClockOutLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import ConfirmationsIsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import GenerateLocalConfirmationNum from '../../Confirmations/CreateUpdate/OnCommit/GenerateLocalConfirmationNum';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';
import TimeSheetCreateUpdatePersonnelNumber from '../../TimeSheets/CreateUpdate/TimeSheetCreateUpdatePersonnelNumber';
import getMinuteInterval from '../../TimeSheets/Entry/CreateUpdate/TimeSheetEntryMinuteInterval';
import getCATSMinuteIntervalDecimal from '../../TimeSheets/Entry/CreateUpdate/TimeSheetEntryMinuteIntervalDecimal';
import GenerateTimeEntryID from '../../TimeSheets/GenerateTimeEntryID';
import TimeSheetsIsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';
import IsOperationLevelAssigmentType from './IsOperationLevelAssigmentType';
import GenerateConfirmationCounter from '../../Confirmations/CreateUpdate/OnCommit/GenerateConfirmationCounter';

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

            return keyGenerationAction.then(key => {
                return ClockInClockOutLibrary.getElapsedClockTime(context, selectedContext.binding.OrderId, selectedContext.binding.OperationNo).then(async (time) => {
                    let binding = selectedContext.binding;
                    const duration = calculateDuration(context, time);
                    let startTime = new Date();

                    if (binding.UserTimeEntry_Nav && binding.UserTimeEntry_Nav.length) {
                        startTime = binding.UserTimeEntry_Nav.reduce((acc, item) => {
                            if (item.PreferenceGroup === 'START_TIME') {
                                return item.PreferenceValue ? new Date(item.PreferenceValue) : acc;
                            } else if (item.PreferenceGroup === 'END_TIME') {
                                return new Date();
                            }
                            return acc;
                        }, new Date());
                    } else {
                        startTime.setMinutes(startTime.getMinutes() - duration);
                    }

                    let confirmCreateProperties = {
                        ...binding,
                        OperationReadlink: binding['@odata.readLink'],
                        ConfirmationNum: key,
                        SubOperation: binding.SubOperation || '',
                        VarianceReason: '',
                        ConfirmationCounter: await GenerateConfirmationCounter(context, binding),
                        StartTime: startTime,
                        ActualDuration: duration.toString(),
                        ActualDurationUOM: 'MIN',
                        ActualWork: duration.toString(),
                        ActualWorkUOM: 'MIN',
                        ActivityType: binding.ActivityType || '',
                        AccountingIndicator: '',
                        Description: '',
                        RemainingWorkUOM: 'H',
                        CompleteFlag: '',
                        FinalConfirmation: isReviewRequired ? '' : 'X',
                        Operation: binding.OperationNo,
                        OrderID: binding.OrderId,
                        PersonnelNumber: persNum,
                        Plant: binding.MainWorkCenterPlant || '',
                        ReverseIndicator: '',
                        OrderType: binding.WOHeader && binding.WOHeader.OrderType,
                        OperationMobileStatus_Nav: binding.OperationMobileStatus_Nav,
                        OperationShortText: binding.OperationShortText,
                        isReviewRequired: isReviewRequired,
                        Hours: getCATSMinuteIntervalDecimal(context),
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
        let duration = (interval) * (Math.round(elapsed/interval));
        if (duration > interval) {
            return duration;
        }
    }

    return interval;
}
