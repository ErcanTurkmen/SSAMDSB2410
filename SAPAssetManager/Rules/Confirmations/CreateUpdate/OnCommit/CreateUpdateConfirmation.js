import ConfirmationCreateUpdateAction from './ConfirmationCreateUpdateAction';
import OnSuccess from './OnSuccess';
import libCom from '../../../Common/Library/CommonLibrary';
import CascadingAction from '../../../Common/Action/CascadingAction';
import IsCompleteAction from '../../../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import CompleteOperationMobileStatusAction from '../../../Operations/MobileStatus/CompleteOperationMobileStatusAction';
import lamIsEnabled from '../../../LAM/LAMIsEnabled';
import IsNotCompleteAction from '../../../WorkOrders/Complete/IsNotCompleteAction';
import CheckIsLam from '../../../Confirmations/CheckIsLam';
import PhaseLibrary from '../../../PhaseModel/PhaseLibrary';
import IsPhaseModelEnabled from '../../../Common/IsPhaseModelEnabled';
import GetPostingDate from './GetPostingDate';
import GetDate from './GetDate';
import GetStartTime from './GetStartTime';
import GetStartTimeStamp from './GetStartTimeStamp';
import GetEndDate from './GetEndDate';
import GetEndTime from './GetEndTime';
import GetCreatedDate from './GetCreatedDate';
import GetCreatedTime from './GetCreatedTime';
import TimeSheetGetPersonnelNumber from '../../../TimeSheets/CreateUpdate/TimeSheetGetPersonnelNumber';
import AnalyticsManager from '../../../AnalyticsManager/AnalyticsManagerLibrary';

export default function CreateUpdateConfirmation(context) {

    let confirmation = context.getBindingObject();
    let pageProxy = context.getPageProxy();
    let isFinalConfirmation = libCom.getControlProxy(context,'IsFinalConfirmation').getValue();
    let previousClientData = context.evaluateTargetPath('#Page:-Previous/#ClientData');
    let mobileStatusAction = previousClientData.mobileStatusAction;
    ///Get the override from client data if avalible. If it's empty use the binding instead (this happens when executing from context menu).
    let confirmationArgs = previousClientData.confirmationArgs ? previousClientData.confirmationArgs:confirmation;
    let isOnCreate = confirmation.IsOnCreate;
    let args = {
        isOnCreate: isOnCreate,
        isFinalConfirmation: isFinalConfirmation,
        WorkOrderId: libCom.getListPickerValue(libCom.getControlProxy(context,'WorkOrderLstPkr').getValue()),
        OperationId: libCom.getListPickerValue(libCom.getControlProxy(context,'OperationPkr').getValue()),
        doCheckOperationComplete: confirmation.doCheckOperationComplete,
        doCheckSubOperationComplete: confirmation.doCheckSubOperationComplete,
        didCreateFinalConfirmation: isFinalConfirmation,
    };

    confirmation.OrderID = libCom.getListPickerValue(libCom.getControlProxy(context,'WorkOrderLstPkr').getValue());
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$expand=OrderMobileStatus_Nav&$filter=OrderId eq '${confirmation.OrderID}'&$top=1`).then(result => {
        let order = undefined;
        if (result && result.length > 0) {
            order = result.getItem(0);
        }
        //Update binding so create/update action has access to this screen data
        confirmation.WorkOrderHeader = order;
        confirmation.SubOperation = libCom.getListPickerValue(libCom.getControlProxy(context,'SubOperationPkr').getValue());
        confirmation.VarianceReason = libCom.getListPickerValue(libCom.getControlProxy(context,'VarianceReasonPkr').getValue());
        confirmation.AccountingIndicator = libCom.getListPickerValue(libCom.getControlProxy(context,'AcctIndicatorPkr').getValue());
        confirmation.ActivityType = libCom.getListPickerValue(libCom.getControlProxy(context,'ActivityTypePkr').getValue());
        confirmation.Operation = libCom.getListPickerValue(libCom.getControlProxy(context,'OperationPkr').getValue());
        confirmation.OrderType = order.OrderType;

        let operationObjectPromise = Promise.resolve();
        if (libCom.getWorkOrderAssnTypeLevel(context) === 'Operation') {
            operationObjectPromise = context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderOperations(OrderId='${confirmation.OrderID}',OperationNo='${confirmation.Operation}')`, [], '$expand=WOHeader,OperationMobileStatus_Nav');
        }

        return operationObjectPromise.then(results => {
            if (results && results.length > 0) {
                confirmation.OperationObject = results.getItem(0);
            }

            pageProxy._context.binding = confirmation;
    
            if (confirmation.SubOperation.length > 0) {
                args.SubOperationId = confirmation.SubOperation;
            }
    
            if (confirmationArgs !== undefined) {
                // Inject all of the confirmation args
                for (const [key, value] of Object.entries(confirmationArgs)) {
                    if (args[key] === undefined) {
                        args[key] = value;
                    }
                }
            }
            let beforeOperationChangeStatusPromise = Promise.resolve();
            if (IsPhaseModelEnabled(context) && isFinalConfirmation && confirmation.OperationObject) {
                beforeOperationChangeStatusPromise = PhaseLibrary.isOperationPhaseStatusChangeablePromise(context, confirmation.OperationObject);
            }
    
            return beforeOperationChangeStatusPromise.then(() => {
                const noODataActionReturnVariable = libCom.getStateVariable(context, 'ConfirmationNoActionsReturnVariableName');
                if (noODataActionReturnVariable) {
                    const updateArgs = {
                        ...args,
                        'ActualWork': libCom.getControlProxy(context,'DurationPkr').getValue(),
                        'ActualDuration': libCom.getControlProxy(context,'DurationPkr').getValue(),
                        'PostingDate': GetPostingDate(context),
                        'StartDate': GetDate(context),
                        'StartTime': GetStartTime(context),
                        'StartTimeStamp': GetStartTimeStamp(context),
                        'FinishDate': GetEndDate(context),
                        'FinishTime': GetEndTime(context),
                        'CreatedDate': GetCreatedDate(context),
                        'CreatedTime': GetCreatedTime(context),
                        'PersonnelNumber': TimeSheetGetPersonnelNumber(context),
                    };
                    libCom.setStateVariable(context, noODataActionReturnVariable, updateArgs);
                    return context.executeAction('/SAPAssetManager/Actions/Page/PreviousPage.action');
                }
            
                let action = new ConfirmationCreateUpdateAction(args);
                let actionOpMobStatus = new CompleteOperationMobileStatusAction(args);
                if (mobileStatusAction !== undefined && mobileStatusAction instanceof CascadingAction) {
                    mobileStatusAction.args.didCreateFinalConfirmation = isFinalConfirmation;
                    action.pushLinkedAction(mobileStatusAction);
                }
                return action.execute(context).then(() => {
                    if (IsCompleteAction(context)) {
                        return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
                    } else {
                        if (isOnCreate) {
                            return action.dismissCurrentModalPage(context).then(() => {
                                return OnSuccess(context, isOnCreate).then(() => {
                                    return checkLAMCreateEnabled(context).then((isLamCreate) => {
                                        if (isLamCreate) {
                                            return context.executeAction('/SAPAssetManager/Actions/LAM/LAMCreateNav.action').then(()=> {
                                                return CheckObjectCompletion(context, action, actionOpMobStatus).then(() => {
                                                    AnalyticsManager.timeEntryCreateSuccess();
                                                });
                                            });
                                    } else {
                                        return CheckObjectCompletion(context, action, actionOpMobStatus).then(() => {
                                            AnalyticsManager.timeEntryCreateSuccess();
                                        });
                                    }
                                });
                                });
                            });
                        } else {
                            return OnSuccess(context, isOnCreate).then(() => {
                                return checkLAMCreateEnabled(context).then((isLamCreate) => {
                                    if (isLamCreate) {
                                        return context.executeAction('/SAPAssetManager/Actions/LAM/LAMCreateNav.action').then(()=> {
                                            return CheckObjectCompletion(context, action, actionOpMobStatus);
                                        });
                                    } else {
                                        return CheckObjectCompletion(context, action, actionOpMobStatus);
                                    }
                                });
                            });
                        }
                    }
                });
            });
        });
    });
}

function CheckObjectCompletion(context, action, actionOpMobStatus) {
    return action.executeSubOperationComplete(context, action).then(() => {
        let completeOperationAction = Promise.resolve();
        if (actionOpMobStatus.args.doCheckOperationComplete !== false) {
            completeOperationAction = action.executeOperationComplete(context, action);
        }
        return completeOperationAction.then(() => {
            if (actionOpMobStatus.args.doCheckWorkOrderComplete !== false) {
                return actionOpMobStatus.executeCheckWorkOrderCompleted(context, actionOpMobStatus);
            }
           return Promise.resolve();
        });
    });
}

function checkLAMCreateEnabled(context) {
    if (lamIsEnabled(context) && IsNotCompleteAction(context)) {
        //Check to see if the confirmation we just added needs a LAM entry created
        libCom.setStateVariable(context, 'LAMDefaultRow', '');
        let confirm = libCom.getStateVariable(context, 'LAMConfirmationNum');
        let counter = libCom.getStateVariable(context, 'LAMConfirmationCounter');
        if (confirm) {
            return libCom.sleep(200).then(() => {
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'Confirmations', [], "$filter=ConfirmationNum eq '" + confirm + "' and ConfirmationCounter eq '" + counter + "'").then(function(results) {
                    if (results && results.length > 0) {
                        let confirmRow = results.getItem(0);
                        return CheckIsLam(context, confirmRow).then((lamDefaultRow) => {
                            if (lamDefaultRow) { //We found a LAM default, so create a new LAM entry for this confirmation
                                libCom.setStateVariable(context, 'LAMDefaultRow', lamDefaultRow);
                                libCom.setStateVariable(context, 'LAMCreateType', 'Confirmation');
                                libCom.setStateVariable(context, 'LAMConfirmationReadLink', confirmRow['@odata.readLink']);
                                libCom.setStateVariable(context, 'TransactionType', 'CREATE');
                                let signature = libCom.getStateVariable(context, 'LAMSignature');
                                if (signature) { //We are capturing a signature first, so defer this action until later
                                    libCom.removeStateVariable(context, 'LAMSignature');
                                    libCom.setStateVariable(context, 'LAMConfirmCreate', true);
                                    return Promise.resolve(false);
                                }
                                return Promise.resolve(true);
                            }
                            return Promise.resolve(false);
                        });
                    }
                    return Promise.resolve(false);
                });
            });
        }
        let confirmation = context.getActionResult('confirmation');
        if (confirmation && confirmation.data) {
            let confirmRow = JSON.parse(confirmation.data);
            return CheckIsLam(context, confirmRow).then((lamDefaultRow) => {
                if (lamDefaultRow) { //We found a LAM default, so create a new LAM entry for this confirmation
                    libCom.setStateVariable(context, 'LAMDefaultRow', lamDefaultRow);
                    libCom.setStateVariable(context, 'LAMCreateType', 'Confirmation');
                    libCom.setStateVariable(context, 'LAMConfirmationReadLink', confirmRow['@odata.readLink']);
                    libCom.setStateVariable(context, 'TransactionType', 'CREATE');
                    let signature = libCom.getStateVariable(context, 'LAMSignature');
                    if (signature) { //We are capturing a signature first, so defer this action until later
                        libCom.removeStateVariable(context, 'LAMSignature');
                        libCom.setStateVariable(context, 'LAMConfirmCreate', true);
                        return Promise.resolve(false);
                    }
                    return Promise.resolve(true);
                }
                return Promise.resolve(false);
            });
        }
    }
    return Promise.resolve(false);
}
