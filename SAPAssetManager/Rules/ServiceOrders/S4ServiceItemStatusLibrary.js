import CommonLibrary from '../Common/Library/CommonLibrary';
import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import S4MobileStatusUpdateOverride from './Status/S4MobileStatusUpdateOverride';
import Logger from '../Log/Logger';
import AutoSyncLibrary from '../ApplicationEvents/AutoSync/AutoSyncLibrary';
import ServiceConfirmationLibrary from '../ServiceConfirmations/CreateUpdate/ServiceConfirmationLibrary';
import ServiceOrderCompleteFromListSwipe from './ServiceItems/MobileStatus/ServiceOrderCompleteFromListSwipe';
import ToolbarRefresh from '../Common/DetailsPageToolbar/ToolbarRefresh';
import IsServiceOrderReleased from './Status/IsServiceOrderReleased';

export default class S4ServiceItemStatusLibrary {

    static confirmServiceItem(context) {
        let message = context.localizeText('complete_item_message');
        return MobileStatusLibrary.showWarningMessage(context, message).then((didConfirm) => {
            if (didConfirm) {
                return IsServiceOrderReleased(context).then(isReleased => {
                    if (isReleased) {
                        return S4ServiceItemStatusLibrary.executeConfirmationStep(context).then(() => {
                            if (ServiceConfirmationLibrary.getInstance().isConfirmFlow()) {
                                //complete should be called after a confirmation creation flow
                                return Promise.resolve();
                            } else {
                                return S4ServiceItemStatusLibrary.executeConfirmAfterConfirmation(context);
                            }
                        });
                    } else {
                        return S4ServiceItemStatusLibrary.executeConfirmAfterConfirmation(context);
                    }
                });
            } else {
                return Promise.resolve();
            }
        })
        .catch((error) => {
            Logger.error('Confirm Service Item', error);
        });
    }

    static executeConfirmationStep(context) {
        let message = context.localizeText('confirmations_add_item_message');
        return MobileStatusLibrary.showWarningMessage(context, message).then((didCreated) => {
            if (didCreated) {
                return ServiceConfirmationLibrary.getInstance().openConfirmatioPageForConfirmFlow(context);
            } else {
                return Promise.resolve();
            }
        });
    }

    static executeConfirmAfterConfirmation(context) {
        return S4ServiceItemStatusLibrary.executeCompleteItem(context).then(() => {
            return S4ServiceItemStatusLibrary.checkIfParentOrderShouldBeCompleted(context).then(() => {
                if (CommonLibrary.getStateVariable(context, 'FinalConfirmationIsCompletingWorkOrder')) {
                    //stop actions chain due to order completion flow
                    return Promise.resolve();
                } else {
                    return ToolbarRefresh(context).then(() => {
                        return AutoSyncLibrary.autoSyncOnStatusChange(context);
                    });
                }
            });
        })
        .catch((error) => {
            Logger.error('Confirm Service Item', error);
        });
    }

    static executeCompleteItem(context) {
        if (!context.binding) return Promise.reject();

        context.showActivityIndicator('');

        let entitySet = context.binding['@odata.readLink'] + '/MobileStatus_Nav';
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '').then(function(result) {
            let updatedMobileStatus = result.getItem(0);

            const COMPLETE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
            updatedMobileStatus.MobileStatus = COMPLETE;
            updatedMobileStatus.Status = `${updatedMobileStatus.ObjectType}: ${COMPLETE}`;
            return context.executeAction(S4MobileStatusUpdateOverride(context, context.binding, updatedMobileStatus));
        })
        .catch((error) => {
            Logger.error('Confirm Service Item', error);
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
        })
        .finally(() => {
            context.dismissActivityIndicator();
        });
    }

    static checkIfParentOrderShouldBeCompleted(context) {
        const COMPLETE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

        let entitySet = context.binding['@odata.readLink'] + '/S4ServiceOrder_Nav';
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '$expand=MobileStatus_Nav,ServiceItems_Nav/MobileStatus_Nav').then(function(result) {
            if (result.length) {
                let order = result.getItem(0);
                let isAllItemsCompleted = order.ServiceItems_Nav.every(item => {
                    return item.MobileStatus_Nav ? item.MobileStatus_Nav.MobileStatus === COMPLETE : false;
                });

                if (isAllItemsCompleted) {
                    return S4ServiceItemStatusLibrary.executeCompleteParentOrder(context, order);
                }
            }

            return Promise.resolve();
        });
    }

    static executeCompleteParentOrder(context, order) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusOperationCompleteConfirmation.action',
            'Properties': {
                'Title': context.localizeText('confirmation_complete_so_warning_title'),
                'Message': context.localizeText('confirmation_complete_so_warning_message'),
            },
        }).then((doSetComplete) => {
            if (doSetComplete.data === true) {
                CommonLibrary.setStateVariable(context, 'FinalConfirmationIsCompletingWorkOrder', true);
                context.getClientData().currentObject = order;
                return ServiceOrderCompleteFromListSwipe(context, order);
            }
            return Promise.resolve();
        });
    }

    static unconfirmServiceItem(context) {
        let message = context.localizeText('unconfirm_service_item_warning_message');
        return MobileStatusLibrary.showWarningMessage(context, message)
            .then(doMarkUnconfirm => {
                if (!doMarkUnconfirm) {
                    return Promise.resolve();
                }

                context.showActivityIndicator('');

                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Common/GenericDiscard.action',
                    'Properties': {
                        'Target': {
                            'EntitySet': 'PMMobileStatuses',
                            'EditLink': context.binding.MobileStatus_Nav['@odata.editLink'],
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                        },
                    },
                }).then(result => {
                    let mobileStatus = JSON.parse(result.data);
                    context.binding.MobileStatus_Nav.MobileStatus = mobileStatus.MobileStatus;
                    return context.executeAction({
                        'Name': '/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationUnconfirmSuccessMessage.action',
                        'Properties': {
                            'Message': context.localizeText('service_item_unconfirmed'),
                        },
                    }).then(() => {
                        return ToolbarRefresh(context).then(() => {
                            return AutoSyncLibrary.autoSyncOnStatusChange(context);
                        });
                    });
                });
            })
            .catch((error) => {
                Logger.error('Confirm Service Item', error);
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
            })
            .finally(() => {
                context.dismissActivityIndicator();
            });
    }
}
