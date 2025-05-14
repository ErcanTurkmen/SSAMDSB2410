import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';
import libMeter from '../../Meter/Common/MeterLibrary';
import MeterSectionLibrary from '../../Meter/Common/MeterSectionLibrary';
import { meterWasReplacedWithInstallation } from '../../Meter/CreateUpdate/MeterReplaceInstall';

export default function MeterDetailsOnLoad(context) {
    let meterTransactionType;
    context.setActionBarItemVisible(0, false); //take readings
    context.setActionBarItemVisible(1, false); //replace
    context.setActionBarItemVisible(2, false); //uninstall
    context.setActionBarItemVisible(3, false); //disconnect
    context.setActionBarItemVisible(4, false); //reconnect
    context.setActionBarItemVisible(5, false); //edit

    let targetEntity;
    let expand = [];

    // Only enable buttons if we're not on a Device entity
    if (context.binding['@odata.type'] !== '#sap_mobile.Device') {

        //Current page can have OrderISULink or DisconnectionObject as the context. Need to check which one is the current context.
        if (context.binding.DisconnectActivity_Nav) {
            targetEntity = context.binding['@odata.readLink'] + '/DisconnectActivity_Nav';
            expand = ['WOHeader_Nav/OrderMobileStatus_Nav', 'WOHeader_Nav/OrderISULinks'];
        } else {
            targetEntity = context.binding['@odata.readLink'] + '/Workorder_Nav';
            expand = ['OrderMobileStatus_Nav'];
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', targetEntity, [], '$expand=' + expand.join(',')).then(result => {
            if (result && result.getItem(0)) {
                let WOHeader = '';
                if (result.getItem(0).WOHeader_Nav) {
                    WOHeader = result.getItem(0).WOHeader_Nav;
                } else {
                    WOHeader = result.getItem(0);
                }
                return MeterSectionLibrary.isTechObjectStarted(context, WOHeader).then(function(isStarted) {
                    if (isStarted) {
                        if (context.binding.DisconnectActivity_Nav) {
                            expand = '$expand=DisconnectDoc_Nav,DisconnectActivity_Nav/WOHeader_Nav/OrderISULinks,Device_Nav/DeviceCategory_Nav/Material_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,Device_Nav/DeviceLocation_Nav';
                        } else {
                            expand = '$expand=Workorder_Nav/DisconnectActivity_Nav/DisconnectObject_Nav,Installation_Nav,Premise_Nav,Device_Nav/DeviceCategory_Nav/Material_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,Device_Nav/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,Device_Nav/DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderMobileStatus_Nav,Workorder_Nav/OrderISULinks,Device_Nav/MeterReadings_Nav';
                        }
                        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], expand).then(results => {
                            if (results && results.length > 0) {
                                let binding = context.binding.DisconnectActivity_Nav ? results.getItem(0) : context.binding;
                                meterTransactionType = binding.ISUProcess;
                                if ((meterTransactionType) !== undefined) {
                                    switch (meterTransactionType) {
                                        case 'READING':
                                            enableReading(context, binding);
                                            break;
                                        case 'REPAIR':
                                            displayTakeReadingActionBarButton(context);
                                            break;
                                        case 'REPLACE':
                                            enableReplace(context, binding);
                                            break;
                                        case 'REMOVE':
                                            enableRemove(context,binding);
                                            break;
                                        case 'INSTALL':
                                        case 'REP_INST':
                                            enableInstall(context, binding);
                                            break;
                                    }
                                } else if ((meterTransactionType = result.getItem(0).WOHeader_Nav.OrderISULinks[0].ISUProcess) !== undefined) {
                                    if (meterTransactionType === 'DISCONNECT' && result.getItem(0).ActivityStatus === '10') {
                                        enableDisconnect(context, binding);
                                    } else if (meterTransactionType === 'RECONNECT' && result.getItem(0).ActivityStatus === '20') {
                                        enableReconnect(context, binding);
                                    }
                                }
                            }
                        });
                    }
                    return Promise.resolve();
                });
            } else {
                return Promise.resolve();
            }
        });
    }
}

export function allowReadingsAndEdit(context) {
    displayTakeReadingActionBarButton(context);
    context.setActionBarItemVisible(5, true);
}

export function enableReconnect(context, binding) {
    if (libMeter.isLocal(binding) && libMeter.isProcessed(binding)) {
        allowReadingsAndEdit(context);
    } else if (!libMeter.isProcessed(binding)) {
        displayTakeReadingActionBarButton(context);
        context.setActionBarItemVisible(4, true);
    }
}

export function enableDisconnect(context, binding) {
    if (libMeter.isLocal(binding) && libMeter.isProcessed(binding)) {
        allowReadingsAndEdit(context);
    } else if (!libMeter.isProcessed(binding)) {
        displayTakeReadingActionBarButton(context);
        context.setActionBarItemVisible(3, true);
    }
}

export function enableRemove(context, binding) {
    if (libMeter.isLocal(binding) && libMeter.isProcessed(binding)) {
        allowReadingsAndEdit(context);
    } else if (!libMeter.isProcessed(binding)) {
        context.setActionBarItemVisible(2, true);
    }
}

export function enableInstall(context, binding) {
    if (libMeter.isLocal(binding) && libMeter.isProcessed(binding)) {
        allowReadingsAndEdit(context);
    }
}

export function enableReplace(context, binding) {
    const hasInstalledMeter = meterWasReplacedWithInstallation(context, binding.EquipmentNum);
    if (libMeter.isLocal(binding) && libMeter.isProcessed(binding) && hasInstalledMeter) {
        allowReadingsAndEdit(context);
    } else if (libMeter.isLocal(binding) && libMeter.isProcessed(binding) && !hasInstalledMeter) {
        context.setActionBarItemVisible(1, true);
        context.setActionBarItemVisible(5, true);
    } else if (!libMeter.isProcessed(binding)) {
        context.setActionBarItemVisible(1, true);
    }
}

export function enableReading(context, binding) {
    if (binding.Device_Nav && binding.Device_Nav.MeterReadings_Nav) {
        let allReadingsArray = binding.Device_Nav.MeterReadings_Nav;

        //We don't want to allow further readings if there exists an aperiodic reading with MRO
        //So we look for a reading with any of the aperiodic reason codes and a MR Doc ID
        let aperiodicReadingsWithMROFound = allReadingsArray.find(reading => {
            return reading.MeterReadingReason !== '01' && reading.MeterReadingDocID;
        });

        if (aperiodicReadingsWithMROFound !== undefined || allReadingsArray.length === 0) {
            displayTakeReadingActionBarButton(context);
        }

    } else {
        displayTakeReadingActionBarButton(context);
    }
}

function displayTakeReadingActionBarButton(context) {
    const INSTALL = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallMeterType.global').getValue();
    const REMOVE = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveMeterType.global').getValue();

    let meterTransactionType = context.binding.ISUProcess;
    if (!IsClassicLayoutEnabled(context) && (meterTransactionType === INSTALL || meterTransactionType === REMOVE)) {
        context.setActionBarItemVisible(0, false);
    } else {
        context.setActionBarItemVisible(0, true);
    }
}
