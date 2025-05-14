import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterDetailsOnReturn(context) {
    const disableUpdate = context.getClientData().MeterDetailsUpdateDisabled;
    
    if (disableUpdate) {
        let meterTransactionType = context.binding.ISUProcess;
        if (!meterTransactionType) {
            if (context.binding.DisconnectActivity_Nav && !Array.isArray(context.binding.DisconnectActivity_Nav)) {
                meterTransactionType = context.binding.DisconnectActivity_Nav.WOHeader_Nav.OrderISULinks[0].ISUProcess;
            }
        }
        if (meterTransactionType && meterTransactionType !== 'INSTALL' && meterTransactionType !== 'REP_INST') {
            const previousPageProxy = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage');
            previousPageProxy.setActionBarItemVisible(0, false); //take readings
            previousPageProxy.setActionBarItemVisible(1, false); //replace
            previousPageProxy.setActionBarItemVisible(2, false); //uninstall
            previousPageProxy.setActionBarItemVisible(3, false); //disconnect
            previousPageProxy.setActionBarItemVisible(4, false); //reconnect
            previousPageProxy.setActionBarItemVisible(5, false); //edit

            let isuLink;

            if (context.binding['@odata.type'] === '#sap_mobile.OrderISULink') {
                try {
                    isuLink = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').getClientData().ISULink['@odata.editLink'];
                    if (!isuLink) {
                        isuLink = context.binding['@odata.readLink'];
                    } else {
                        if (meterTransactionType === 'INSTALL_EDIT') {
                            previousPageProxy.setActionBarItemVisible(0, true); //take readings
                            previousPageProxy.setActionBarItemVisible(5, true); //edit
                            return Promise.resolve();
                        }
                    }
                } catch (exc) {
                    isuLink = context.binding['@odata.readLink'];
                }
            } else {
                isuLink = context.binding.DisconnectActivity_Nav.WOHeader_Nav.OrderISULinks[0]['@odata.readLink'];
            }

            return context.read('/SAPAssetManager/Services/AssetManager.service', isuLink, [],'$expand=Device_Nav/DeviceCategory_Nav/Material_Nav,DeviceLocation_Nav/Premise_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderISULinks').then(function(result) {
                const orderISULink = result.getItem(0);
                const orderISULinkIsProcessed = libMeter.isProcessed(orderISULink);
                if (orderISULink) {
                    if (meterTransactionType === 'READING' || meterTransactionType === 'DISCONNECT' || meterTransactionType === 'RECONNECT') {
                        previousPageProxy.setActionBarItemVisible(0, true);
                        
                        if (meterTransactionType === 'DISCONNECT') {
                            if (libMeter.isProcessed(context.binding)) {
                                previousPageProxy.setActionBarItemVisible(5, true);
                            } else {
                                previousPageProxy.setActionBarItemVisible(3, true);
                            }
                        } else if (meterTransactionType === 'RECONNECT') {
                            if (libMeter.isProcessed(context.binding)) {
                                previousPageProxy.setActionBarItemVisible(5, true);
                            } else {
                                previousPageProxy.setActionBarItemVisible(4, true);
                            }
                        }
                    } else if (meterTransactionType.startsWith('REPLACE')) {
                        if (orderISULinkIsProcessed) {
                            previousPageProxy.setActionBarItemVisible(5, true);

                            if (orderISULink.Workorder_Nav?.OrderISULinks?.length === 1) {
                                previousPageProxy.setActionBarItemVisible(1, true);
                            } else {
                                previousPageProxy.setActionBarItemVisible(0, true);
                            }
                        }
                    } else if (meterTransactionType.startsWith('REMOVE')) {
                        if (orderISULinkIsProcessed) {
                            previousPageProxy.setActionBarItemVisible(0, true);
                            previousPageProxy.setActionBarItemVisible(5, true);
                        }
                    }
                }
            });
        }
    }
    context.getClientData().MeterDetailsUpdateDisabled = undefined;
    return Promise.resolve();
}
