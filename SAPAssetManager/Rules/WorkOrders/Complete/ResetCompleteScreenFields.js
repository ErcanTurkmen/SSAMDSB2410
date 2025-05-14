import libCom from '../../Common/Library/CommonLibrary';
import RemoveCreatedExpenses from '../../Expense/List/RemoveCreatedExpenses';
import RedrawCompletePage from './RedrawCompletePage';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import Logger from '../../Log/Logger';
import { resetTimeStepAction } from './CancelCompletePage';

export default function ResetCompleteScreenFields(context) {
    let page = context.getPageProxy();
    try {
        page.showActivityIndicator();

        let resetActions = [];

        WorkOrderCompletionLibrary.updateStepState(page, 'expenses', {
            value: '',
            count: 0,
        });
        resetActions.push(RemoveCreatedExpenses(context));

        if (WorkOrderCompletionLibrary.getStepValue(page, 'mileage')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(page, 
                WorkOrderCompletionLibrary.getStepDataLink(page, 'mileage')));
                
            WorkOrderCompletionLibrary.updateStepState(page, 'mileage', {
                    value: '',
                    data: '',
                    link: '',
                });
        }
       
        if (WorkOrderCompletionLibrary.getStepValue(page, 'notification')) {
            WorkOrderCompletionLibrary.getStepDataItemLink(page, 'notification').forEach((itemLink)=> {
                resetActions.push(WorkOrderCompletionLibrary.resetStep(page, itemLink));
            });

            WorkOrderCompletionLibrary.updateStepState(page, 'notification', {
                value: '',
                data: WorkOrderCompletionLibrary.getStep(page, 'notification').initialData,
                lam: '',
                itemLinks: [],
            });

            resetActions.push(WorkOrderCompletionLibrary.resetStep(page, 
                WorkOrderCompletionLibrary.getStepDataLink(page, 'notification')));
        }

        if (WorkOrderCompletionLibrary.getStepValue(page, 'lam')) {
            WorkOrderCompletionLibrary.updateStepState(page, 'lam', {
                value: '',
                data: '',
                lam: '',
            });

            resetActions.push(WorkOrderCompletionLibrary.resetStep(page, 
                WorkOrderCompletionLibrary.getStepDataLink(page, 'lam')));
        }

        if (WorkOrderCompletionLibrary.getStepValue(page, 'time')) {
            WorkOrderCompletionLibrary.updateStepState(page, 'time', {
                value: '',
                data: '',
                lam: '',
            });

            resetActions.push(resetTimeStepAction(page));
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'confirmation')) {
            let order = WorkOrderCompletionLibrary.getInstance().getBinding(page);
            let confirmationLink = WorkOrderCompletionLibrary.getStepDataLink(page, 'confirmation');

            WorkOrderCompletionLibrary.updateStepState(page, 'confirmation', {
                value: '',
                data: '',
            });
            WorkOrderCompletionLibrary.updateStepState(page, 'confirmation_item', {
                value: '',
                data: '',
            });

            //delete transaction between s4 order and s4 confirmation
            const deleteTransactionAction = context.read('/SAPAssetManager/Services/AssetManager.service', confirmationLink + '/TransHistories_Nav', [], `$filter=sap.islocal() and RelatedObjectID eq '${order.ObjectID}'`)
                .then(result => {
                    if (result.length === 2) {
                        return Promise.all([
                            WorkOrderCompletionLibrary.resetStep(page, result.getItem(0)['@odata.readLink']), //transaction for confirmation
                            WorkOrderCompletionLibrary.resetStep(page, result.getItem(1)['@odata.readLink']), //transaction for confirmation item
                        ]);
                    } else if (result.length === 1) { 
                        return WorkOrderCompletionLibrary.resetStep(page, result.getItem(0)['@odata.readLink']); //transaction for confirmation
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
                        return WorkOrderCompletionLibrary.resetStep(page, items.getItem(0)['@odata.readLink']);
                    }
                    return Promise.resolve();
                })
                .catch(error => {
                    Logger.error('delete s4 confirmation item', error);
                    return Promise.resolve();
                });

            //delete s4 confirmation
            const deleteConfirmationAction = Promise.all([deleteTransactionAction, deleteConfirmationItemAction]).then(() => {
                return WorkOrderCompletionLibrary.resetStep(page, confirmationLink);
            });

            resetActions.push(deleteConfirmationAction);
        } else if (WorkOrderCompletionLibrary.getStepValue(context, 'confirmation_item')) {
            let confirmation = WorkOrderCompletionLibrary.getStepData(page, 'confirmation_item');

            WorkOrderCompletionLibrary.updateStepState(page, 'confirmation_item', {
                value: '',
                data: '',
            });
     
            let confirmationLink = WorkOrderCompletionLibrary.getStepDataLink(page, 'confirmation_item') + '/S4ServiceConfirmation_Nav';

            //delete transaction between s4 order and s4 confirmation
            const deleteTransactionAction = context.read('/SAPAssetManager/Services/AssetManager.service', confirmationLink + '/TransHistories_Nav', [], `$filter=sap.islocal() and ObjectID eq '${confirmation.ObjectID}' and ItemNo eq '${confirmation.ItemNo}'`)
                .then(result => {
                    if (result.length === 1) { 
                        return WorkOrderCompletionLibrary.resetStep(page, result.getItem(0)['@odata.readLink']); //transaction for confirmation
                    }
                    return Promise.resolve();
                }).catch(error => {
                    Logger.error('delete transaction between s4 order and s4 confirmation', error);
                    return Promise.resolve();
                });

            //delete s4 confirmation item
            const deleteConfirmationItemAction = deleteTransactionAction.then(() => {
                return WorkOrderCompletionLibrary.resetStep(page, WorkOrderCompletionLibrary.getStepDataLink(page, 'confirmation_item'));
            });

            resetActions.push(deleteConfirmationItemAction);
        }

        if (WorkOrderCompletionLibrary.getStepValue(page, 'note')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(page, 
                WorkOrderCompletionLibrary.getStepDataLink(page, 'note')));

            WorkOrderCompletionLibrary.updateStepState(page, 'note', {
                value: '',
                data: '',
                link: '',
            });
        }

        if (WorkOrderCompletionLibrary.getStepValue(page, 'digit_signature')) {
            resetActions.push(page.executeAction({'Name': 
                '/SAPAssetManager/Actions/OData/DigitalSignature/DeleteDraftSignatureFromUserPrefs.action',
                'Properties': {
                    'Target': {
                        'ReadLink': WorkOrderCompletionLibrary.getStepDataLink(page, 'digit_signature'),
                    },
                },
            }));
            
            WorkOrderCompletionLibrary.updateStepState(page, 'digit_signature', {
                value: '',
                link: '',
            });    
        }

        if (WorkOrderCompletionLibrary.getStepValue(page, 'signature')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(page, 
                WorkOrderCompletionLibrary.getStepDataLink(page, 'signature')));

            WorkOrderCompletionLibrary.updateStepState(page, 'signature', {
                value: '',
                link: '',
            });
        }

        let links = WorkOrderCompletionLibrary.getStep(page, 'smartforms').links || [];
        if (links.length) {
            links.forEach(link => {
                resetActions.push(WorkOrderCompletionLibrary.resetStep(page, link));
            });

            WorkOrderCompletionLibrary.updateStepState(page, 'smartforms', {
                    value: '',
                    status: '',
                    links: '',
                });
        }

        return Promise.all(resetActions)
            .then(() => {
                libCom.setStateVariable(page, 'expenses', []);

                RedrawCompletePage(page);
                page.dismissActivityIndicator();
            });
    } catch (failure) {
        Logger.error('Reset confirmation failed', failure);
        page.dismissActivityIndicator();
    }
}
