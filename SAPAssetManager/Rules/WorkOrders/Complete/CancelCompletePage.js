import libCom from '../../Common/Library/CommonLibrary';
import RemoveCreatedExpenses from '../../Expense/List/RemoveCreatedExpenses';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import Logger from '../../Log/Logger';
import RedrawCompletePage from './RedrawCompletePage';
import { IsBulkConfirmationQueueActive, RunNextBulkConfirmationAction } from '../Operations/BulkConfirmationQueue';
import AnalyticsManager from '../../AnalyticsManager/AnalyticsManagerLibrary';
import ConfirmationsIsEnabled from '../../Confirmations/ConfirmationsIsEnabled';

export default function CancelCompletePage(context) {
    try {
        let resetActions = [];
        resetActions.push(RemoveCreatedExpenses(context));

        if (WorkOrderCompletionLibrary.getStepValue(context, 'mileage')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(context,
                WorkOrderCompletionLibrary.getStepDataLink(context, 'mileage')));

            WorkOrderCompletionLibrary.updateStepState(context, 'mileage', {
                value: '',
                data: '',
                link: '',
            });
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'lam')) {
            WorkOrderCompletionLibrary.updateStepState(context, 'lam', {
                value: '',
                data: '',
                lam: '',
            });

            resetActions.push(WorkOrderCompletionLibrary.resetStep(context,
                WorkOrderCompletionLibrary.getStepDataLink(context, 'lam')));
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'notification')) {
            WorkOrderCompletionLibrary.getStepDataItemLink(context, 'notification').forEach((itemLink)=> {
                resetActions.push(WorkOrderCompletionLibrary.resetStep(context, itemLink));
            });
            resetActions.push(WorkOrderCompletionLibrary.resetStep(context,
                WorkOrderCompletionLibrary.getStepDataLink(context, 'notification')));
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'note')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(context,
                WorkOrderCompletionLibrary.getStepDataLink(context, 'note')));

            WorkOrderCompletionLibrary.updateStepState(context, 'note', {
                value: '',
                data: '',
                link: '',
            });
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'time')) {
            resetActions.push(resetTimeStepAction(context));
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'confirmation')) {
            let order = WorkOrderCompletionLibrary.getInstance().getBinding(context);
            let confirmationLink = WorkOrderCompletionLibrary.getStepDataLink(context, 'confirmation');

            //delete transaction between s4 order and s4 confirmation
            const deleteTransactionAction = context.read('/SAPAssetManager/Services/AssetManager.service', confirmationLink + '/TransHistories_Nav', [], `$filter=sap.islocal() and RelatedObjectID eq '${order.ObjectID}'`)
                .then(result => {
                    if (result.length === 2) {
                        return Promise.all([
                            WorkOrderCompletionLibrary.resetStep(context, result.getItem(0)['@odata.readLink']), //transaction for confirmation
                            WorkOrderCompletionLibrary.resetStep(context, result.getItem(1)['@odata.readLink']), //transaction for confirmation item
                        ]);
                    } else if (result.length === 1) { 
                        return WorkOrderCompletionLibrary.resetStep(context, result.getItem(0)['@odata.readLink']); //transaction for confirmation
                    }
                    return Promise.resolve();
                }).catch(error => {
                    Logger.error('delete transaction between s4 order and s4 confirmation', error);
                    return Promise.resolve();
                });

            //delete s4 confirmation item
            const deleteConfirmationItemAction = context.read('/SAPAssetManager/Services/AssetManager.service', confirmationLink + '/ServiceConfirmationItems_Nav', [], '$filter=sap.islocal()')
                .then(items => {
                    if (items.length) {
                        return WorkOrderCompletionLibrary.resetStep(context, items.getItem(0)['@odata.readLink']);
                    }
                    return Promise.resolve();
                })
                .catch(error => {
                    Logger.error('delete s4 confirmation item', error);
                    return Promise.resolve();
                });

            //delete s4 confirmation
            const deleteConfirmationAction = Promise.all([deleteTransactionAction, deleteConfirmationItemAction]).then(() => {
                return WorkOrderCompletionLibrary.resetStep(context, confirmationLink);
            });

            resetActions.push(deleteConfirmationAction);
        } else if (WorkOrderCompletionLibrary.getStepValue(context, 'confirmation_item')) {
            let confirmation = WorkOrderCompletionLibrary.getStepData(context, 'confirmation_item');
            let confirmationLink = WorkOrderCompletionLibrary.getStepDataLink(context, 'confirmation_item') + '/S4ServiceConfirmation_Nav';

            //delete transaction between s4 order and s4 confirmation
            const deleteTransactionAction = context.read('/SAPAssetManager/Services/AssetManager.service', confirmationLink + '/TransHistories_Nav', [], `$filter=sap.islocal() and ObjectID eq '${confirmation.ObjectID}' and ItemNo eq '${confirmation.ItemNo}'`)
                .then(result => {
                    if (result.length === 1) { 
                        return WorkOrderCompletionLibrary.resetStep(context, result.getItem(0)['@odata.readLink']); //transaction for confirmation
                    }
                    return Promise.resolve();
                }).catch(error => {
                    Logger.error('delete transaction between s4 order and s4 confirmation', error);
                    return Promise.resolve();
                });

            //delete s4 confirmation item
            const deleteConfirmationItemAction = deleteTransactionAction.then(() => {
                return WorkOrderCompletionLibrary.resetStep(context, WorkOrderCompletionLibrary.getStepDataLink(context, 'confirmation_item'));
            });

            resetActions.push(deleteConfirmationItemAction);
        }


        if (WorkOrderCompletionLibrary.getStepValue(context, 'digit_signature')) {
            resetActions.push(context.executeAction({'Name':
                '/SAPAssetManager/Actions/OData/DigitalSignature/DeleteDraftSignatureFromUserPrefs.action',
                'Properties': {
                    'Target': {
                        'ReadLink': WorkOrderCompletionLibrary.getStepDataLink(context, 'digit_signature'),
                    },
                },
            }));
            WorkOrderCompletionLibrary.updateStepState(context, 'digit_signature', {
                value: '',
                link: '',
            });
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'signature')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(context,
                WorkOrderCompletionLibrary.getStepDataLink(context, 'signature')));

            WorkOrderCompletionLibrary.updateStepState(context, 'signature', {
                value: '',
                link: '',
            });
        }

        let links = WorkOrderCompletionLibrary.getStep(context, 'smartforms').links || [];
        if (links.length) {
            links.forEach(link => {
                resetActions.push(WorkOrderCompletionLibrary.resetStep(context, link));
            });

            WorkOrderCompletionLibrary.updateStepState(context, 'smartforms', {
                    value: '',
                    status: '',
                    links: '',
                });
        }

        return Promise.all(resetActions).then(() => {
            libCom.setStateVariable(context, 'expenses', []);
            libCom.removeBindingObject(context);
            libCom.removeStateVariable(context, 'contextMenuSwipePage');
            WorkOrderCompletionLibrary.resetValidationMessages(context);
            RedrawCompletePage(context);
            WorkOrderCompletionLibrary.clearSteps(context);
            WorkOrderCompletionLibrary.getInstance().setCompleteFlag(context, false);
            WorkOrderCompletionLibrary.getInstance().deleteBinding(context);
            return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action').then(() => {
                if (IsBulkConfirmationQueueActive(context)) {
                    return RunNextBulkConfirmationAction(context);
                }
                return Promise.resolve();
            }).then(() => {
                if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                    //Add AnalyticsManager Check here
                    AnalyticsManager.operationCompleteCancel();
                } else if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
                    //Add AnalyticsManager Check here
                    AnalyticsManager.suboperationCompleteCancel();
                } else if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                    //Add AnalyticsManager Check here
                    AnalyticsManager.orderCompleteCancel();
                } else {
                    return;
                }
            });
        });
    } catch (failure) {
        Logger.error('Reset confirmation failed', failure);
    }
}

export function resetTimeStepAction(context) {
    const confirmationEnabled = ConfirmationsIsEnabled(context);
    const properties = {};
    const link = WorkOrderCompletionLibrary.getStepDataLink(context, 'time');

    if (confirmationEnabled) {
        properties.Headers = {
            'OfflineOData.TransactionID': WorkOrderCompletionLibrary.getStepData(context, 'time').ConfirmationNum || link.match(/ConfirmationNum='([^']*)'/)?.[1],
        };
    }

    return WorkOrderCompletionLibrary.resetStep(context, link, properties, confirmationEnabled);
}
