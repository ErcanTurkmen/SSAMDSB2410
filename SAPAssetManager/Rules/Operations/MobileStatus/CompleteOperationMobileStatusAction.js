
import FetchRequest from '../../Common/Query/FetchRequest';
import CompleteMobileStatusAction from '../../MobileStatus/CompleteMobileStatusAction';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import WorkOrderCompleteFromWOListSwipe from '../../WorkOrders/MobileStatus/WorkOrderCompleteFromWOListSwipe';
import { IsBulkConfirmationQueueActive, RunNextBulkConfirmationAction } from '../../WorkOrders/Operations/BulkConfirmationQueue';
import FinalConfirmation from '../../Confirmations/BlankFinal/FinalConfirmation';

/**
 * Operation for executing a
 */
export default class CompleteOperationMobileStatusAction extends CompleteMobileStatusAction {

    name() {
        return 'CompleteMobileStatusAction_Operation';
    }

    getDefaultArgs() {
        let defaultArgs = super.getDefaultArgs();
        defaultArgs.doCheckWorkOrderComplete = true;
        return defaultArgs;
    }

    setActionQueue(actionQueue) {

        if (this.args.isOperationStatusChangeable) { //Set the mobile status to Complete only if operation level assignment
            actionQueue.unshift(this.setMobileStatusComplete);
        }

        // Add a check to see if the parent Work Order should be completed
        if (this.args.doCheckWorkOrderComplete) {
            actionQueue.push(this.executeCheckWorkOrderCompleted);
        }
        super.setActionQueue(actionQueue);
    }

    entitySet() {
        return 'MyWorkOrderOperations';
    }

    identifier() {
        return `OperationNo='${this.args.OperationId}',OrderId='${this.args.WorkOrderId}'`;
    }

    didSetFinalConfirmationParams(context) {
        super.didSetFinalConfirmationParams(context);
        context.getClientData().FinalConfirmationOrderID = this.args.WorkOrderId;
        context.getClientData().FinalConfirmationOperation = this.args.OperationId;
        // Make sure this is found but blank
        context.getClientData().FinalConfirmationSubOperation = '';
        context.getClientData().FinalConfirmation = 'X';

        context.binding.FinalConfirmationOrderID = this.args.WorkOrderId;
        context.binding.FinalConfirmationOperation = this.args.OperationId;
        // Make sure this is found but blank
        context.binding.FinalConfirmationSubOperation = '';
        context.binding.FinalConfirmation = 'X';
        return true;
    }

    requestSetWorkOrderComplete(context) {
        let promises = [];
        context.dismissActivityIndicator();
        return context.executeAction('/SAPAssetManager/Actions/MobileStatus/MobileStatusOperationCompleteConfirmation.action').then((doSetComplete) => {
            if (doSetComplete.data === true) {
                libCommon.setStateVariable(context, 'FinalConfirmationIsCompletingWorkOrder', true);
                if (context.currentPage.isModal()) { // We have to close this page to show Signature Control Modal
                    promises.push(context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action'));
                    context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().currentObject = this.getWorkOrderDetails(context);
                } else {
                    context.getClientData().currentObject = this.getWorkOrderDetails(context);
                }
                return Promise.all(promises).then(() => {
                    return WorkOrderCompleteFromWOListSwipe(context, this.getWorkOrderDetails(context));
                });
            }

            if (IsBulkConfirmationQueueActive(context)) {
                return RunNextBulkConfirmationAction(context);
            }

            return Promise.resolve(true);
        });
    }
    getWorkOrderDetails(context) {
        const binding = context.binding;
        return binding?.WorkOrderHeader || binding?.WOHeader || binding?.WorkOrderOperation?.WOHeader || binding;
    }
    executeCheckWorkOrderCompleted(context, instance) {

        let args = instance.args;

        if (args.didCreateFinalConfirmation && MobileStatusLibrary.isHeaderStatusChangeable(context)) { //only proceed if final and workorder status can be changed
            return MobileStatusLibrary.isMobileStatusComplete(context, 'MyWorkOrderHeaders', args.WorkOrderId).then(status => {
                if (status) { //already complete so exit
                    if (IsBulkConfirmationQueueActive(context)) {
                        return RunNextBulkConfirmationAction(context);
                    }

                    return Promise.resolve(true);
                } else {
                    // Count the number of Operations that have a mobile status
                    return MobileStatusLibrary.getStatusForOperations(context, args.WorkOrderId).then(query => {
                        let fetchRequest = new FetchRequest('MyWorkOrderOperations', query);

                        return fetchRequest.execute(context).then(results => {
                            // Second clause was added because we were seeing something funky. DB didn't seem to be updating before the above query
                            if (results.length === 0 || (results.length === 1 && results.getItem(0).OperationNo === args.OperationId)) {
                                // There are no Operations of this Work Order.
                                // Ask user if they would like to complete the Work Order
                                return libSuper.checkReviewRequired(context, context.binding).then(review => { //Do not auto-complete work order if it requires a review
                                    if (!review) {
                                        return instance.requestSetWorkOrderComplete(context, instance);
                                    }

                                    if (IsBulkConfirmationQueueActive(context)) {
                                        return RunNextBulkConfirmationAction(context);
                                    }

                                    return Promise.resolve(true);
                                });
                            }

                            if (IsBulkConfirmationQueueActive(context)) {
                                return RunNextBulkConfirmationAction(context);
                            }

                            return Promise.resolve(true);
                        });
                    });
                }
            });
        } else {
            if (IsBulkConfirmationQueueActive(context)) {
                return RunNextBulkConfirmationAction(context);
            }
            
            return Promise.resolve(true);
        }

    }

    /**
     * Calls the parent method ExecuteCreateBlankConfirmationIfMissing.
     * If a blank confirmation was created, the value of the DidCreateFinalConfirmation argument should change. 
     * If DidCreateFinalConfirmation is set to true, ExecuteCheckWorkOrderCompleted will be executed.
     * @param {ClientAPI} context
     * @param {CompleteOperationMobileStatusAction} instance 
     * @returns {Promise}
     */
    executeCreateBlankConfirmationIfMissing(context, instance) {
        return super.executeCreateBlankConfirmationIfMissing(context, instance).then(() => { 
            return libSuper.decideCreateBlankConfirmation(context, instance).then(create => {
                if (create && !instance.args.didCreateFinalConfirmation && instance.didSetFinalConfirmationParams(context)) {
                    instance.args.didCreateFinalConfirmation = FinalConfirmation(context);
                }
                return true;
            });
        });
    }
}
