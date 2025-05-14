import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';
import common from '../Common/Library/CommonLibrary';

export default function OperationSelfAssign(context, binding) {
    if (!IsPhaseModelEnabled(context)) {
        return Promise.resolve();
    }

    if (binding.PersonNum === '00000000') {
        let employee = common.getPersonnelNumber();
        return context.executeAction({
            'Name' : '/SAPAssetManager/Actions/MobileStatus/OperationSelfAssign.action',
            'Properties': {
                'Properties': {
                    'OperationNo': binding.OperationNo,
                    'OrderId': binding.OrderId,
                    'EmployeeTo': employee,
                    'WorkCenterFrom': binding.WOHeader.MainWorkCenter,
                },
            },
        }).then((selfAssignResult) => {
            selfAssignResult = JSON.parse(selfAssignResult.data);
            // Only attempt to upload Operation Transfer if device is online
            if (context.getPageProxy().nativescript.connectivityModule.getConnectionType() > 0) {
                // Upload the created WorkOrderTransfer record
                return context.executeAction('/SAPAssetManager/Actions/MobileStatus/OperationTransferUpload.action').then(() => {
                    // Check Error Archive to see if issues occurred during assignment
                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', [], "$filter=RequestMethod eq 'POST' and RequestURL eq '/WorkOrderTransfers'").then(entries => {
                        if (entries.length === 0) {
                            // If no errors, re-download Operation and proceed to update toolbar
                            return context.executeAction({
                                'Name': '/SAPAssetManager/Actions/MobileStatus/OperationTransferDownload.action',
                                'Properties': {
                                    'DefiningRequests' : [{
                                        'Name': 'MyWorkOrderOperations',
                                        'Query': `$filter=OrderId eq '${binding.OrderId}' and OperationNo eq '${binding.OperationNo}'`,
                                    }],
                                },
                            }).then(() => {
                                // Update PersonNum so subsequent transitions don't trigger an upload
                                binding.PersonNum = employee;
                            });
                        } else {
                            // If errors occurred trying to assign operation, delete all related ErrorArchive entries (normally should only be one) and return Promise.reject()
                            let actionPromises = [];
                            entries.forEach(entry => {
                                actionPromises.push(context.executeAction({
                                    'Name' : '/SAPAssetManager/Actions/Common/ErrorArchiveDiscard.action',
                                    'Properties': {
                                        'OnSuccess': '',
                                        'OnFailure': '',
                                        'Target': {
                                            'EntitySet': 'ErrorArchive',
                                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                                            'QueryOptions': `$filter=RequestID eq ${entry.RequestID}`,
                                        },
                                    },
                                }));
                            });
                            return Promise.all(actionPromises).then(() => {
                                return Promise.reject();
                            });
                        }
                    });
                }, () => {
                    // If upload fails due to a network issue, roll back Transfer
                    return rollbackAssignment(context, selfAssignResult['@odata.editLink']).then(() => {
                        return Promise.reject();
                    });
                });
            } else {
                // "Transfer" operation so client doesn't think it's unassigned
                return context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationUpdateAssignment.action',
                    'Properties': {
                        'Properties': {
                            'PersonNum' : employee,
                        },
                        'Headers': {
                            'Transaction.Ignore': 'true',
                        },
                    },
                });
            }
        });
    } else {
        return Promise.resolve();
    }
}

function rollbackAssignment(context, assignmentEditLink) {
    return context.executeAction({
        'Name' : '/SAPAssetManager/Actions/Common/GenericDiscard.action',
        'Properties': {
            'Target': {
                'EntitySet': 'WorkOrderTransfers',
                'EditLink': assignmentEditLink,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
        },
    });
}
