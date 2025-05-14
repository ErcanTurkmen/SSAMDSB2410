import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import FinalizeCompletePage from './FinalizeCompletePage';
import IsMeterComponentEnabled from '../../ComponentsEnablement/IsMeterComponentEnabled';

export default function FinalizeCompletePageMessage(context) { 
    if (WorkOrderCompletionLibrary.getInstance().isServiceOrderFlow() || WorkOrderCompletionLibrary.getInstance().isServiceItemFlow() ) {
        return FinalizeCompletePage(context);
    }

    return checkMeterComponentBeforeCompletion(context).then((result) => {
        if (result.data) {
            return FinalizeCompletePage(context);
        }
        return Promise.resolve();
    });
}

export function checkMeterComponentBeforeCompletion(context, customBinding) {
    let binding = customBinding || context.getPageProxy().binding || WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let title = context.localizeText('completion_WO_title');
    let message = 'meter_action_has_not_been_performed_for_wo';

    let noStatusMessage = 'meter_action_has_not_been_performed_for_wo_no_status';
    if (WorkOrderCompletionLibrary.getInstance().isOperationFlow()) {
        message = 'meter_action_has_not_been_performed_for_operation_no_status';
        noStatusMessage = 'meter_action_has_not_been_performed_for_operation';
    }
    if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow()) {
        title = context.localizeText('completion_sub_operation_title');
        message = 'meter_action_has_not_been_performed_for_suboperation_no_status';
        noStatusMessage = 'meter_action_has_not_been_performed_for_suboperation';
    }
    if (customBinding) {
        title = `${context.localizeText('completion_operation_title')} - ${customBinding.OperationShortText} (${customBinding.OperationNo})`;
    }

    if (IsMeterComponentEnabled(context)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${binding.OrderId}')`, [], '$expand=OrderISULinks')
            .then(data => {
                let woData = data.getItem(0);
                if (woData && woData.OrderISULinks.length > 0 && !!woData.OrderISULinks[0].ISUProcess) {
                    let type = woData.OrderType;
                    let activityType = type === 'RC01' ? '03' : '01';

                    switch (type) {
                        case 'CU01':
                            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${binding.OrderId}')`, [], '$expand=OrderISULinks/Device_Nav/MeterReadings_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav').then(results => {
                                if (results && results.length > 0) {
                                    for (let i = 0; i < results.length; i++) {
                                        let isuLinks = results.getItem(i).OrderISULinks;
                                        if (isuLinks && isuLinks.length > 0) {
                                            for (let link of isuLinks) {
                                                let deviceNav = link.Device_Nav;
                                                if (deviceNav && deviceNav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.Status !== 'INST') {
                                                    if (Object.prototype.hasOwnProperty.call(deviceNav,'@sap.isLocal')) {
                                                        return Promise.resolve({data: true});
                                                    }
                                                    for (let meterReadingObj of deviceNav.MeterReadings_Nav) {
                                                        if (Object.prototype.hasOwnProperty.call(meterReadingObj,'@sap.isLocal')) {
                                                            return Promise.resolve({data: true});
                                                        }
                                                    }
                                                    return showMessageDialog(context, title, noStatusMessage);
                                                }
                                            }
                                        }
                                    }

                                }
                                return showMessageDialog(context, title, message);
                            });
                        case 'SM01':
                            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${binding.OrderId}')`, [], '$expand=OrderISULinks/Device_Nav/MeterReadings_Nav').then(results => {
                                if (results && results.length > 0) {
                                    for (let i = 0; i < results.length; i++) {
                                        let isuLinks = results.getItem(i).OrderISULinks;
                                        if (isuLinks && isuLinks.length > 0) {
                                            for (let link of isuLinks) {
                                                let deviceNav = link.Device_Nav;
                                                if (deviceNav) {
                                                    if (Object.prototype.hasOwnProperty.call(deviceNav,'@sap.isLocal')) {
                                                        return Promise.resolve({data: true});
                                                    }
                                                    for (let meterReadingObj of deviceNav.MeterReadings_Nav) {
                                                        if (Object.prototype.hasOwnProperty.call(meterReadingObj,'@sap.isLocal')) {
                                                            return Promise.resolve({data: true});
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                }
                                return showMessageDialog(context, title, message);
                            });
                        case 'MR01':
                        case 'SM02':
                            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${binding.OrderId}')`, [], '$expand=OrderISULinks/Device_Nav/MeterReadings_Nav').then(results => {
                                if (results && results.length > 0) {
                                    for (let i = 0; i < results.length; i++) {
                                        let isuLinks = results.getItem(i).OrderISULinks;
                                        if (isuLinks && isuLinks.length > 0) {
                                            for (let link of isuLinks) {
                                                let deviceNav = link.Device_Nav;
                                                if (deviceNav) {
                                                    for (let meterReadingObj of deviceNav.MeterReadings_Nav) {
                                                        if (Object.prototype.hasOwnProperty.call(meterReadingObj,'@sap.isLocal')) {
                                                            return Promise.resolve({data: true});
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                }
                                return showMessageDialog(context, title, message);
                            });
                        case 'RP01':
                            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${binding.OrderId}')`, [], '$expand=OrderISULinks/Device_Nav/MeterReadings_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav').then(results => {
                                let installed = false;
                                let removed = false;
                                let removedESTO = false;
                                if (results && results.length > 0) {
                                    for (let i = 0; i < results.length; i++) {
                                        let isuLinks = results.getItem(i).OrderISULinks;
                                        if (isuLinks && isuLinks.length > 0) {
                                            for (let link of isuLinks) {
                                                let deviceNav = link.Device_Nav;
                                                if (deviceNav) {
                                                    if (Object.prototype.hasOwnProperty.call(deviceNav,'@sap.isLocal') && deviceNav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.Status === 'INST') {
                                                        installed = true;
                                                    }
                                                    if (Object.prototype.hasOwnProperty.call(deviceNav,'@sap.isLocal') && deviceNav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.Status === 'UNST' || deviceNav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.Status === 'ESTO') {
                                                        removed = true;
                                                    }
                                                    if (!Object.prototype.hasOwnProperty.call(deviceNav,'@sap.isLocal') && deviceNav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.Status === 'ESTO') {
                                                        removedESTO = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (installed && removed) {
                                    return Promise.resolve({data: true});
                                } else if (removedESTO) {
                                    return showMessageDialog(context, title, noStatusMessage);
                                }
                                return showMessageDialog(context, title, message);
                            });
                        case 'DC01':
                        case 'RC01':
                            return context.read('/SAPAssetManager/Services/AssetManager.service', 'DisconnectionObjects', [], `$filter=DisconnectActivity_Nav/OrderId eq '${binding.OrderId}' and DisconnectActivity_Nav/ActivityType eq '${activityType}'&$expand=DisconnectActivity_Nav,Device_Nav`).then(results => {
                                let hasLocal = results._array.every(obj => Object.prototype.hasOwnProperty.call(obj,'@sap.isLocal') && Object.prototype.hasOwnProperty.call(obj.DisconnectActivity_Nav,'@sap.isLocal') && Object.prototype.hasOwnProperty.call(obj.Device_Nav,'@sap.isLocal'));
                                if (hasLocal) {
                                    return Promise.resolve({data: true});
                                } else {
                                    let disconnect = false;
                                    let reconnect = false;
                                    if (type === 'DC01') {
                                        disconnect = results._array.every(obj => (obj.DisconnectActivity_Nav.DisconnectFlag === 'X'));
                                    } else if (type === 'RC01') {
                                        reconnect = results._array.every(obj => (obj.DisconnectActivity_Nav.DisconnectFlag === ''));
                                    }
                                    if (disconnect || reconnect) {
                                        return showMessageDialog(context, title, message);
                                    }
                                    return showMessageDialog(context, title, noStatusMessage);
                                }
                            });
                        default:
                            return Promise.resolve({data: true});
                    }
                }
                return Promise.resolve({data: true});
            })
            .catch(() => {
                return Promise.resolve({data: true});
        });
    }

    return Promise.resolve({data: true});
}

function showMessageDialog(context, title, message) {
    return context.executeAction(
        {
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties': {
                'Title': title,
                'Message': context.localizeText(message),
                'OKCaption': context.localizeText('ok'),
                'CancelCaption': context.localizeText('cancel'),
            },
        },
    );
}
