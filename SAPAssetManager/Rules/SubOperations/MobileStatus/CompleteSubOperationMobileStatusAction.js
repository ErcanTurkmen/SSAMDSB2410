
import FetchRequest from '../../Common/Query/FetchRequest';
import CompleteMobileStatusAction from '../../MobileStatus/CompleteMobileStatusAction';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import NavOnCompleteOperationPage from '../../WorkOrders/Operations/NavOnCompleteOperationPage';
import CompleteOperationMobileStatusAction from '../../Operations/MobileStatus/CompleteOperationMobileStatusAction';
import sdfIsFeatureEnabled from '../../Forms/SDF/SDFIsFeatureEnabled';
import FormInstanceCount from '../../Forms/SDF/FormInstanceCount';

export default class CompleteSubOperationMobileStatusAction extends CompleteMobileStatusAction {

    getDefaultArgs() {
        let defaultArgs = super.getDefaultArgs();
        defaultArgs.doCheckWorkOrderComplete = true;
        defaultArgs.doCheckOperationComplete = true;
        return defaultArgs;
    }

    setActionQueue(actionQueue) {

        if (this.args.isSubOperationStatusChangeable) {
            actionQueue.unshift((context) => this.setMobileStatusComplete(context, undefined, this.args.subOperation));
        }

        // Add a check to see if the parent Work Order should be completed
        if (this.args.doCheckOperationComplete) {
            actionQueue.push(this.executeCheckOperationCompleted);
        }

        super.setActionQueue(actionQueue);
    }

    name() {
        return 'CompleteMobileStatusAction_SubOperation';
    }

    entitySet() {
        return 'MyWorkOrderSubOperations';
    }

    identifier() {
        return `OperationNo='${this.args.OperationId}',OrderId='${this.args.WorkOrderId}',SubOperationNo='${this.args.SubOperationId}'`;
    }

    didSetFinalConfirmationParams(context) {
        super.didSetFinalConfirmationParams(context);
        context.getClientData().FinalConfirmationOrderID = this.args.WorkOrderId;
        context.getClientData().FinalConfirmationOperation = this.args.OperationId;
        context.getClientData().FinalConfirmationSubOperation = this.args.SubOperationId;
        context.getClientData().FinalConfirmation = 'X';

        this.args.subOperation.FinalConfirmationOrderID = this.args.WorkOrderId;
        this.args.subOperation.FinalConfirmationOperation = this.args.OperationId;
        this.args.subOperation.FinalConfirmationSubOperation = this.args.SubOperationId;
        this.args.subOperation.FinalConfirmation = 'X';
        return true;
    }

    requestSetOperationComplete(context, instance, review) {
        let title, message;
        if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
            title = context.localizeText('confirmation_complete_op_warning_title');
            message = context.localizeText('confirmation_complete_op_warning_message');
        } else {
            title = context.localizeText('confirm_operation_warning_message');
            message = context.localizeText('confirmation_confirm_op_warning_message');
        }

        const ok = context.localizeText('yes');
        const no = context.localizeText('no');
        return CommonLibrary.showWarningDialog(context, message, title, ok, no).then((doSetComplete) => {
            if (doSetComplete) {
                if (MobileStatusLibrary.isOperationStatusChangeable(context) || review) {
                    const operation = this.getOperationDetails();
                    if (!operation && context.binding) {
                        context.binding.doOperationCompleteAfterSubOperationConfirmation = true;
                        return Promise.resolve(true);
                    }
                    return NavOnCompleteOperationPage(context, operation);
                } else {
                    let actionArgs = {
                        doCheckWorkOrderComplete: instance.args.doCheckWorkOrderComplete,
                        WorkOrderId: instance.args.WorkOrderId,
                        OperationId: instance.args.OperationId,
                        isOperationStatusChangeable: MobileStatusLibrary.isOperationStatusChangeable(context),
                        isHeaderStatusChangeable: MobileStatusLibrary.isHeaderStatusChangeable(context),
                    };

                    let action = new CompleteOperationMobileStatusAction(actionArgs);
                    // Push this action ahead of the WorkOrder complete action
                    instance.pushLinkedAction(action, ['CompleteMobileStatusAction_WorkOrder']);
                }
                return Promise.resolve(true);
            }
            return Promise.resolve(true);
        }).catch(() => {
            // Catching a no response
            // Keep chugging
            return Promise.resolve(true);
        });
    }

    getOperationDetails() {
        return this.args.subOperation?.WorkOrderOperation ?? this.args.subOperation;
    }

    executeCheckOperationCompleted(context, instance) {

        // Should not check for Operation Completion in Assignment type 3
        if (MobileStatusLibrary.isSubOperationStatusChangeable(context)) {
            return Promise.resolve(true);
        }

        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            return MobileStatusLibrary.isMobileStatusConfirmed(context, '', instance.args.subOperation).then(result => { //check to see if the parent operation is confirmed already
                if (result) {
                    return Promise.resolve(true);
                }
                return instance.checkSubOperationsStatus(context, instance);
            });
        } else { // Operation level assignemnt. check to see if the parent operation is completed already
            return MobileStatusLibrary.isMobileStatusComplete(context, 'MyWorkOrderOperations', instance.args.WorkOrderId, instance.args.OperationId).then(status => {
                if (status) { //already complete so exit
                    return Promise.resolve(true);
                }
                return instance.checkSubOperationsStatus(context, instance);
            });
        }
    }

    checkSubOperationsStatus(context, instance) {
        // Count the number of Operations that have a mobile status
        const args = instance.args;
        return MobileStatusLibrary.getStatusForSubOperations(context, args.WorkOrderId, args.OperationId).then(query => {
            let fetchRequest = new FetchRequest('MyWorkOrderSubOperations', query);
            return fetchRequest.execute(context).then(results => {
                // Second clause was added because we were seeing something funky. DB didn't seem to be updating before the above query
                if (results.length === 0 || (results.length === 1 && results.getItem(0).SubOperationNo === args.SubOperationId)) {
                    return libSuper.checkReviewRequired(context, args.subOperation, true).then(review => {
                        return MobileStatusLibrary.isMobileStatusConfirmed(context, args.subOperation?.WorkOrderOperation).then(isOperationConfirmed => {
                            // There are no more outstanding Sub Operations on this operation
                            // Ask user if they would like to complete the operation
                            let sdfPromises = [];
                            if (sdfIsFeatureEnabled(context)) {
                                const binding = context.binding.WorkOrderOperation || context.getPageProxy().binding;
                                sdfPromises.push(
                                    FormInstanceCount(context, true, binding['@odata.readLink']).then((count) => {
                                        if (count !== 0) {
                                            return Promise.reject();
                                        } else {
                                            return Promise.resolve();
                                        }
                                    }).catch(() => {
                                        return Promise.reject();
                                    }));
                            }
                            return Promise.all(sdfPromises).then(() => {
                                if (!review && !isOperationConfirmed) {  //Operation does not require a supervisor review and hasn't been already confirmed
                                    return instance.requestSetOperationComplete(context, instance, review);
                                }
                                return Promise.resolve(true);
                            }, () => {
                                return Promise.resolve(true);
                            });
                        });

                    });
                }
                return Promise.resolve(true);
            });
        });
    }
}
