import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import CreateLinks from '../../../../SAPAssetManager/Rules/Confirmations/CreateUpdate/OnCommit/CreateLinks';
import OperationMobileStatusLibrary from '../../../../SAPAssetManager/Rules/Operations/MobileStatus/OperationMobileStatusLibrary';
import libMobile from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import CompleteOperationMobileStatusAction from '../../../../SAPAssetManager/Rules/Operations/MobileStatus/CompleteOperationMobileStatusAction';
import libAutoSync from '../../../../SAPAssetManager/Rules/ApplicationEvents/AutoSync/AutoSyncLibrary';
import PDFGenerateDuringCompletion from '../../../../SAPAssetManager/Rules/PDF/PDFGenerateDuringCompletion';
import libClock from '../../../../SAPAssetManager/Rules/ClockInClockOut/ClockInClockOutLibrary';
import generateGUID from '../../../../SAPAssetManager/Rules/Common/guid';
import ODataDate from '../../../../SAPAssetManager/Rules/Common/Date/ODataDate';
import IsPhaseModelEnabled from '../../../../SAPAssetManager/Rules/Common/IsPhaseModelEnabled';
import PhaseLibrary from '../../../../SAPAssetManager/Rules/PhaseModel/PhaseLibrary';
import FetchRequest from '../../../../SAPAssetManager/Rules/Common/Query/FetchRequest';
import TimeSheetsIsEnabled from '../../../../SAPAssetManager/Rules/TimeSheets/TimeSheetsIsEnabled';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import { AddBulkConfirmationAction, RunNextBulkConfirmationAction } from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/BulkConfirmationQueue';
import ConfirmationsIsEnabled from '../../../../SAPAssetManager/Rules/Confirmations/ConfirmationsIsEnabled';
import TimeSheetCreateUpdateCreateLinks from '../../../../SAPAssetManager/Rules/TimeSheets/CreateUpdate/TimeSheetCreateUpdateCreateLinks';
import { CreateBulkConfirmationSignature, ResetBulkConfirmationSignatureFlow } from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/BulkConfirmationLibrary';
import { checkMeterComponentBeforeCompletion } from '../../../../SAPAssetManager/Rules/WorkOrders/Complete/FinalizeCompletePageMessage';

function createUserTimeEntries(context, item) {
    if (libMobile.isOperationStatusChangeable(context)) { //Handle clock out create for operation
        const odataDate = new ODataDate();
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                'Properties': {
                    'RecordId': generateGUID(),
                    'UserGUID': libCom.getUserGuid(context),
                    'OperationNo': item.Operation,
                    'OrderId': item.OrderID,
                    'PreferenceGroup': libClock.isCICOEnabled(context) ? 'CLOCK_OUT' : 'END_TIME',
                    'PreferenceName': item.OrderID,
                    'PreferenceValue': odataDate.toDBDateTimeString(context),
                    'UserId': libCom.getSapUserName(context),
                },
                'CreateLinks': [{
                    'Property': 'WOOperation_Nav',
                    'Target':
                    {
                        'EntitySet': 'MyWorkOrderOperations',
                        'ReadLink': "MyWorkOrderOperations(OrderId='" + item.OrderID + "',OperationNo='" + item.Operation + "')",
                    },
                }],
            },
        });
    }

    return Promise.resolve();
}

function getOperationCompleteAction(context, item) {
    let actionArgs = {
        OperationId: item.Operation,
        WorkOrderId: item.OrderID,
        isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
        isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
        didCreateFinalConfirmation: item.FinalConfirmation === 'X',
    };

    let action = new CompleteOperationMobileStatusAction(actionArgs);
    context.getClientData().confirmationArgs = {
        doCheckOperationComplete: false,
    };
    context.getClientData().mobileStatusAction = action;

    return action;
}

function getOperationMobileStatus(context, item) {
    let mobileStatus = item.OperationMobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'Operation');
    }

    return mobileStatus;
}


export default function WorkOrderOperationsConfirmation(context) {
    let operationsConfirmations = libCom.getStateVariable(context, 'OperationsToConfirm');
    let failedOperations = [];
    let promiseArr = [];
    let isTimesheetEnabled = !ConfirmationsIsEnabled(context) && TimeSheetsIsEnabled(context);

    for (let i = 0; i < operationsConfirmations.length; i++) {
        let item = operationsConfirmations[i];
        if (isTimesheetEnabled && !item.ActivityType) {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/ActivityTypeForOperationRequiredError.action').then(function() {
                return Promise.reject(false);
            });
        }

        promiseArr.push(checkMeterComponentBeforeCompletion(context, item).then((result) => {
            if (result.data) {
                return confirmOperation(context, item, failedOperations, i);
            }
            failedOperations.push(item);
            return Promise.resolve();
        }));
    }

    return Promise.all(promiseArr).then(() => {
        ResetBulkConfirmationSignatureFlow(context);
        libCom.setStateVariable(context, 'OperationsToConfirm', []);
        libCom.setStateVariable(context, 'selectedOperations', []);
        if (failedOperations.length) {
            libCom.setStateVariable(context, 'FailedOperations', failedOperations);
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/ConfirmOperationsFailureMessage.action');
        }
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationConfirmSuccessMessage.action').then(() => {
           //AddBulkConfirmationAction(context, libAutoSync.autoSyncOnStatusChange.bind(this, context));
            return RunNextBulkConfirmationAction(context);
        });
    });
}

function confirmOperation(context, item, failedOperations, index) {
    let beforeOperationChangeStatusPromise = Promise.resolve();
    if (IsPhaseModelEnabled(context) && item) {
        beforeOperationChangeStatusPromise = PhaseLibrary.isOperationPhaseStatusChangeablePromise(context, item);
    }

    return beforeOperationChangeStatusPromise.then(() => {
        let pageProxy = context;
        pageProxy.setActionBinding(item);

        let properties = getConfirmationProperties(context, item);
        let isTimesheetEnabled = !ConfirmationsIsEnabled(context) && TimeSheetsIsEnabled(context);
        const assignmentType = libCom.getWorkOrderAssnTypeLevel(context);

        if (isTimesheetEnabled) {
            let date = item.Date || new ODataDate().toLocalDateString();
            return createOverviewIfMissing(context, date).then(() => {
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action',
                    'Properties': {
                        'Target': {
                            'EntitySet': 'CatsTimesheets',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                        },
                        'Properties': {
                            'Counter': item.ConfirmationNum,
                            'Date': date,
                            'Hours': item.Hours,
                            'AttendAbsenceType': item.AttendAbsenceType || '',
                            'ActivityType': item.ActivityType,
                            'Workcenter': item.MainWorkCenter,
                            'PersonnelNumber': item.PersonnelNumber || '',
                            'ControllerArea': item.ControllerArea || '',
                        },
                        'Headers': {
                            'OfflineOData.RemoveAfterUpload': true,
                            'OfflineOData.TransactionID': item.ConfirmationNum,
                        },
                        'CreateLinks': TimeSheetCreateUpdateCreateLinks(context, item),
                    },
                }).then(() => {
                    if (assignmentType === 'Operation' || assignmentType === 'SubOperation') {
                        if (item.isReviewRequired) {
                            return completeOperation(context, item, failedOperations);
                        } else {
                            return OperationMobileStatusLibrary.createBlankConfirmation(context, index, item).then(() => {
                                return completeOperation(context, item, failedOperations);
                            });
                        }
                    } else { //header level, so create blank final confirmation
                        return OperationMobileStatusLibrary.createBlankConfirmation(context, index, item);
                    }
                }).catch((error) => {
                    item.error = error;
                    failedOperations.push(item);
                    return null;
                });
            }).catch((error) => {
                item.error = error;
                failedOperations.push(item);
                return null;
            });
        } else {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Confirmations/ConfirmationCreateBlank.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'Confirmations',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                    },
                    'Properties': properties,
                    'Headers': {
                        'OfflineOData.RemoveAfterUpload': true,
                        'OfflineOData.TransactionID': item.ConfirmationNum,
                    },
                    'CreateLinks': CreateLinks(pageProxy, item),
                },
            }).then(() => {
               // return createConfirmationOverviewRow(context).then(() => {
                    if (assignmentType === 'Operation' || assignmentType === 'SubOperation') {
                        return completeOperation(context, item, failedOperations);
                    }
                    return Promise.resolve();
                //});
            });
        }
    }).catch((error) => {
        item.error = error;
        failedOperations.push(item);
        return null;
    });
}

function createConfirmationOverviewRow(context) {
    let postingDate = new ODataDate().toLocalDateString();
    let query = `$filter=PostingDate eq datetime'${postingDate}'&$top=1`;

    // If the overview is not found, create a new one
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ConfirmationOverviewRows', [], query).then(result => {
        if (result === undefined || result.length === 0) {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Confirmations/ConfirmationOverviewRowCreate.action',
                'Properties': {
                    'Properties': {
                        'PostingDate': postingDate,
                    },
                }});
        } else {
            return Promise.resolve(true);
        }
    });
}

function createOverviewIfMissing(context, date) {
    return new FetchRequest('CatsTimesheetOverviewRows').get(context, `datetime'${date}'`).catch(() => {
        return createOverviewRow(context, date);
    });

}

function createOverviewRow(context, date) {
    context.getClientData().TimeSheetsOverviewRowDate = date;
    return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetOverviewRowCreate.action');
}

function completeOperation(context, item, failedOperations) {
    let completeAction = getOperationCompleteAction(context, item);
    let mobileStatus = getOperationMobileStatus(context, item);
    let pageContext = context;

    let isTimesheetEnabled = !ConfirmationsIsEnabled(context) && TimeSheetsIsEnabled(context);
    if (!isTimesheetEnabled && !item.FinalConfirmation && !item.isReviewRequired) {
        return Promise.resolve();
    } 

    if (mobileStatus) {
        return CreateBulkConfirmationSignature(context, item).then(() => {
            //return createUserTimeEntries(context, item).then(() => {
                return completeAction.setMobileStatusComplete(pageContext, completeAction, item).then(() => {
                    return OperationMobileStatusLibrary.isAnyOperationStarted(context).then(() => {
                        // if (!item.isReviewRequired) {
                        //     AddBulkConfirmationAction(context, PDFGenerateDuringCompletion.bind(this, context, item));
                        // }
                        AddBulkConfirmationAction(context, completeAction.executeCheckWorkOrderCompleted.bind(this, pageContext, completeAction));
                        return Promise.resolve();
                    });
                });
            //});
        })
        .catch((error) => {
            item.error = error;
            failedOperations.push(item);
            Logger.error(error);
        });
    }

    return Promise.resolve();
}


function getConfirmationProperties(context, item) {
    let odataDate = new ODataDate();
    let currentDate = odataDate.toDBDateTimeString(context);

    let properties = {
        'ConfirmationNum': item.ConfirmationNum,
        'ConfirmationCounter': item.ConfirmationCounter,
        'SubOperation': item.SubOperation || '',
        'CompleteFlag': item.CompleteFlag,
        'FinalConfirmation': item.FinalConfirmation,
        'Operation': item.Operation,
        'OrderID': item.OrderID,
        'StartTimeStamp': currentDate,
        'StartDate': item.StartDate,
        'StartTime': item.StartTime,
        'FinishDate': item.FinishDate,
        'FinishTime': item.FinishTime,
        'PostingDate': item.PostingDate,
        'CreatedDate': item.CreatedDate,
        'CreatedTime': item.CreatedTime
    };

    if (item.FinishDate && item.StartDate && item.CreatedDate) {
        properties.StartTimeStamp = item.StartTimeStamp;
        properties.StartDate = item.StartDate;
        properties.StartTime = item.StartTime;
        properties.FinishDate = item.FinishDate;
        properties.FinishTime = item.FinishTime;
        properties.PostingDate = item.PostingDate;
        properties.CreatedDate = item.CreatedDate;
        properties.CreatedTime = item.CreatedTime;
    }

    return properties;
}
