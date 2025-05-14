import CommonLibrary from '../Common/Library/CommonLibrary';
import DiscardGoodsMovement from './CreateUpdate/DiscardGoodsMovement';
import DiscardReadings from './CreateUpdate/DiscardReadings';
import DiscardDeviceUpdateQueryOptions from './Discard/DiscardDeviceUpdateQueryOptions';
import DiscardStatusInstallQueryOptions from './Discard/DiscardStatusInstallQueryOptions';
import MeterListSelectPressed from './MeterListSelectPressed';

/**
* Confirmation dialog and setting state variable from selected items to discard
* @param {IClientAPI} clientAPI
*/
export default async function MeterListDiscardToolbar(context) {
    let clientAPI = context;
    if (context.getPageProxy) {
        clientAPI = context.getPageProxy();
    }
    return clientAPI.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
        'Properties': {
            'CancelCaption': clientAPI.localizeText('cancel'),
            'OKCaption': clientAPI.localizeText('continue_text'),
            'Title': clientAPI.localizeText('discard_installing'),
            'Message': clientAPI.localizeText('discard_confirm'),
        },
    }).then(({ data }) => {
        if (data === false) {
            return false;
        }
        const selectedItems = CommonLibrary.getStateVariable(clientAPI, 'selectedMeters') || [];
        const itemsToDelete = selectedItems.filter((itemBinding) => itemBinding['@sap.isLocal']);
        clientAPI.getClientData().ItemsToDelete = itemsToDelete;
        return discardInstalledItem(clientAPI);
    });
}

function discardInstalledItem(context, idx) {
    context.showActivityIndicator();
    const currentIndex = idx || 0;
    const itemsToDelete = context.getPageProxy().getClientData().ItemsToDelete;
    const binding = itemsToDelete[currentIndex];
    if (binding) {
        context.setActionBinding(binding);
        return DiscardReadings(context, binding).then(() => {
            return DiscardGoodsMovement(context, binding).then(() => {
                let discardAction;
                context.getClientData().NoNeedsNavBackAction = true;
                if (context.binding['@sap.inErrorState']) {
                    discardAction = DiscardStatusInstallFromErrorArchiveCustom(context, binding);
                } else {
                    discardAction = DiscardStatusInstallCustom(context, binding);
                }
                return Promise.all([discardAction]).finally(() => {
                    context.dismissActivityIndicator();
                    return discardInstalledItem(context, currentIndex + 1);
                });
            });
        });
    } else {
        context.getClientData().ItemsToDelete = undefined;
        context.getClientData().NoNeedsNavBackAction = undefined;
        context.dismissActivityIndicator();
        return MeterListSelectPressed(context);
    }
}

function DiscardStatusInstallCustom(context, binding) {
    const editLink = binding['@odata.editLink'];
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Meters/Discard/DiscardStatusInstall.action',
        'Properties': {
            'Target': {
                'EntitySet': 'MyEquipObjectStatuses',
                'EditLink': `${editLink}/Device_Nav/Equipment_Nav/ObjectStatus_Nav`,
            },
            'OnSuccess': {
                'Name': '/SAPAssetManager/Actions/Meters/Discard/DiscardDeviceUpdate.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'Devices',
                        'EditLink': binding.Device_Nav['@odata.editLink'],
                    },
                    'OnSuccess': {
                        'Name': '/SAPAssetManager/Actions/Meters/Discard/DiscardInstall.action',
                        'Properties': {
                            'Target': {
                                'EntitySet': 'OrderISULinks',
                                'EditLink': editLink,
                            },
                        },
                    },
                },
            },
        },
    });
}

function DiscardStatusInstallFromErrorArchiveCustom(context, binding) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Meters/Discard/DiscardStatusInstallFromErrorArchive.action',
        'Properties': {
            'Target': {
                'EntitySet': 'ErrorArchive',
                'QueryOptions': DiscardStatusInstallQueryOptions(context, binding),
            },
            'OnSuccess': {
                'Name': '/SAPAssetManager/Actions/Meters/Discard/DiscardDeviceUpdateFromErrorArchive.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'ErrorArchive',
                        'QueryOptions': DiscardDeviceUpdateQueryOptions(context, binding),
                    },
                },
            },
        },
    });
}
