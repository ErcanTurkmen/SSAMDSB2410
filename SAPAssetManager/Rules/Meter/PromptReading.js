import common from '../Common/Library/CommonLibrary';
import libMeter from '../Meter/Common/MeterLibrary';
import meterReplaceInstall from './CreateUpdate/MeterReplaceInstall';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import {DynamicPageGenerator} from '../FDC/DynamicPageGenerator';

export default function PromptReading(context) {
    const sectionData =
    [{
        'Controls':
        [{
            'Caption': '$(L,serial_number)',
            'IsEditable': false,
            'Value': '/SAPAssetManager/Rules/Meter/MeterReadingCreateSerialNumber.js',
            '_Name': 'SerialNumber',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        },
        {
            'Caption': '$(L,device_category)',
            'IsEditable': false,
            'Value': '/SAPAssetManager/Rules/Meter/MeterReadingCreateDeviceCategory.js',
            '_Name': 'DeviceCategory',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        }],
        '_Type': 'Section.Type.FormCell',
    },
    {
        'Target': {
            'EntitySet': '/SAPAssetManager/Rules/Meter/MeterReadingCreateEntitySet.js',
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '/SAPAssetManager/Rules/Meter/Reading/MeterReadingQueryOptions.js',
        },
        'Controls':
        [{
            'Caption': '$(L,register)',
            'IsEditable': false,
            'Value': '{RegisterNum}',
            '_Name': 'RegisterNum',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        },
        {
            'Caption': '$(L,reading)',
            'IsEditable': true,
            'Value': '/SAPAssetManager/Rules/Meter/Reading/MeterReadingRecordedLocal.js',
            'PlaceHolder': 'None',
            '_Name': 'ReadingValue',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
            'OnValueChange': '/SAPAssetManager/Rules/Meter/Reading/MeterReadingUpdateCaptionWrapper.js',
        },
        {
            'Caption': '$(L,date_time)',
            'IsEditable': true,
            'Mode': 'DateTime',
            'OnValueChange': '/SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput.js',
            'DateTimeEntryMode': 'datetime',
            '_Name': 'ReadingTimeControl',
            '_Type': 'Control.Type.FormCell.DatePicker',
        },
        {
            'Caption': '$(L,set_usage_peak_time)',
            'IsEditable': true,
            'Value': '{UsagePeakTimeBool}',
            'OnValueChange': '/SAPAssetManager/Rules/Meter/Reading/PeakUsageShowHideMultiple.js',
            '_Name': 'PeakTimeSwitch',
            '_Type': 'Control.Type.FormCell.Switch',
        },
        {
            'Caption': '$(L,usage_peak_time)',
            'IsEditable': true,
            'IsVisible': false,
            'Mode': 'DateTime',
            'OnValueChange': '/SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput.js',
            'DateTimeEntryMode': 'datetime',
            'Value': '{DateMaxRead}',
            '_Name': 'PeakUsageTimeControl',
            '_Type': 'Control.Type.FormCell.DatePicker',
        },
        {
            'AllowMultipleSelection': false,
            'Caption': '$(L,note)',
            'IsEditable': true,
            'IsSelectedSectionEnabled': false,
            'Value': '{MeterReaderNote}',
            'OnValueChange': '/SAPAssetManager/Rules/Meter/Reading/SkipMeterReading.js',
            'PickerItems': '/SAPAssetManager/Rules/Meter/Reading/ReadingNoteValues.js',
            '_Name': 'NotePicker',
            '_Type': 'Control.Type.FormCell.ListPicker',
            'IsPickerDismissedOnSelection': true,
            'IsSearchCancelledAfterSelection': true,
        },
        {
            'AllowMultipleSelection': false,
            'Caption': '$(L,reason)',
            'IsEditable': true,
            'Value': '{MeterReadingReason}',
            'IsPickerDismissedOnSelection': true,
            'IsSearchCancelledAfterSelection': true,
            'IsVisible': '/SAPAssetManager/Rules/Meter/Reading/ReadingReasonIsVisible.js',
            'PickerItems': '/SAPAssetManager/Rules/Meter/Reading/ReadingReasonValues.js',
            '_Name': 'ReasonPicker',
            '_Type': 'Control.Type.FormCell.ListPicker',
        },
        {
            'Caption': '$(L,warning_min_max)',
            'IsEditable': false,
            'Value': '/SAPAssetManager/Rules/Meter/Reading/MeterReadingRecordedWarningMinMaxLimit.js',
            'IsVisible': '/SAPAssetManager/Rules/Meter/Reading/MeterReadingLimitsIsVisible.js',
            '_Name': 'WarningMinValue',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        },
        {
            'Caption': '$(L,error_min_max)',
            'IsEditable': false,
            'Value': '/SAPAssetManager/Rules/Meter/Reading/MeterReadingRecordedErrorMinMaxLimit.js',
            'IsVisible': '/SAPAssetManager/Rules/Meter/Reading/MeterReadingLimitsIsVisible.js',
            '_Name': 'ErrorMinValue',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        },
        {
            'Title': '$(L,discard)',
            'IsVisible': false,
            'OnPress': {
                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                'Properties': {
                    'Target': {
                        'EntitySet': "Registers(RegisterNum='{RegisterNum}',RegisterGroup='{RegisterGroup}')",
                    },
                    'OnSuccess': '/SAPAssetManager/Rules/Meter/Reading/DiscardReading.js',
                },
            },
            '_Name': 'DiscardButton',
            '_Type': 'Control.Type.FormCell.Button',
            'Styles': {
                'Value': 'ObjectCellStyleRed',
            },
        }],
        '_Type': 'Section.Type.FormCell',
    }];

    const pageOverrides = {
        'Caption': '$(L,take_readings)',
        'OnLoaded': '/SAPAssetManager/Rules/Meter/Common/HideCancelOnPageLoad.js',
        'OnActivityBackPressed': '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/CancelCheckOnBackNavAndroid.js',
        'ActionBar':
        {
            'Items':
            [{
                'Position': 'left',
                'SystemItem': 'Cancel',
                'Caption': '$(L,cancel)',
                'OnPress': '/SAPAssetManager/Rules/Common/CheckForChangesBeforeClose.js',
            },
            {
                'Position': 'right',
                'SystemItem': '$(PLT,\'Done\',\'\',\'\',\'Done\')',
                'Text': '/SAPAssetManager/Rules/Common/Platform/DoneText.js',
                'OnPress': '/SAPAssetManager/Rules/Meter/CreateUpdate/DeviceMeterReadingsCreateUpdate.js',
            }],
        },
    };

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive) {
        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
    }
    let meterTransactionType = libMeter.getMeterTransactionType(context);
    let OrderISULink = context.binding;

    if (OrderISULink['@odata.type'] !== '#sap_mobile.OrderISULink') {
        OrderISULink = context.binding.DisconnectActivity_Nav.WOHeader_Nav.OrderISULinks[0];
    }

    const { title, batchEquipmentNum } = updateValues(context, meterTransactionType);

    return common.showWarningDialog(context, context.localizeText('reading_message'), title, 'OK', 'Skip').then(function() {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.getClientData().DeviceReadLink, [], '$expand=DeviceCategory_Nav,OrderISULink_Nav/DeviceLocation_Nav,RegisterGroup_Nav/Registers_Nav,Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,MeterReadings_Nav').then(function(result) {
            if (result && result.length === 1) {
                let prevPageBinding = context.evaluateTargetPathForAPI('#Page:-Previous').binding;
                prevPageBinding.DeviceLink = result.getItem(0);
                prevPageBinding.BatchEquipmentNum = batchEquipmentNum;
                try {
                    if (prevPageBinding.OrderISULink !== context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').getClientData().ISULink) {
                        prevPageBinding.OrderISULink = OrderISULink;
                    }
                } catch (exc) {
                    prevPageBinding.OrderISULink = OrderISULink;
                }
                prevPageBinding.ISUProcess = meterTransactionType;
                common.setStateVariable(context, 'METERREADINGOBJ', prevPageBinding);
                const generator = new DynamicPageGenerator(context, null, sectionData, pageOverrides);

                return generator.buildPage().then(actionProperties => {
                    // Hack: Section Bindings are stored on "previous page" which is about to be erased. Store on modal parent instead
                    context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings = context.getClientData().SectionBindings;
                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(function() {
                        return context.executeAction({
                            'Name': '/SAPAssetManager/Actions/Common/GenericNav.action',
                            'Properties': actionProperties,
                            'Type': 'Action.Type.Navigation',
                        });
                    });
                });
            } else {
                return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Meters/MeterUpdatedToast.action').then(function() {
                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                });
            }
        });
    }, function() {
        context.binding.BatchEquipmentNum = batchEquipmentNum;
        context.binding.OrderISULink = OrderISULink;
        return meterReplaceInstall(context);
    });
}

function updateValues(context, meterTransactionType) {
    let title = context.localizeText('meter');
    let batchEquipmentNum = context.binding.BatchEquipmentNum; 
    if (meterTransactionType === 'REMOVE' || meterTransactionType === 'REPLACE') {
        title = context.localizeText('meter_removed');
    } else if (meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST') {
        title = context.localizeText('meter_installed');
    } else if (meterTransactionType === 'DISCONNECT') {
        batchEquipmentNum = String(context.binding.DisconnectActivity_Nav.ActivityNum) + String(context.binding.DisconnectActivity_Nav.DocNum);
        context.getClientData().DeviceReadLink = context.binding.Device_Nav['@odata.readLink'];
        title = context.localizeText('meter_disconnected');
    } else if (meterTransactionType === 'RECONNECT') {
        batchEquipmentNum = String(context.binding.DisconnectActivity_Nav.ActivityNum) + String(context.binding.DisconnectActivity_Nav.DocNum);
        context.getClientData().DeviceReadLink = context.binding.Device_Nav['@odata.readLink'];
        title = context.localizeText('meter_reconnected');
    } else if (meterTransactionType.endsWith('_EDIT')) {
        title = context.localizeText('meter_updated');
    }

    return {
        title,
        batchEquipmentNum,
    };
}
