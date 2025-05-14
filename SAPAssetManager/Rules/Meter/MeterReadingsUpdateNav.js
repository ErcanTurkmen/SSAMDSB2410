import libMeter from '../Meter/Common/MeterLibrary';
import { DynamicPageGenerator } from '../FDC/DynamicPageGenerator';

export default function MeterReadingsUpdateNav(context, replaceBinding) {
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
                        'EntitySet': 'Registers',
                        'QueryOptions': "$filter=RegisterNum eq '{RegisterNum}' and RegisterGroup eq '{RegisterGroup}'",
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

    let binding = replaceBinding || context.binding;
    let batchEquipNum = binding.EquipmentNum;
    let baseBinding = replaceBinding || context.binding;

    if (binding['@odata.type'] !== '#sap_mobile.OrderISULink') {
        batchEquipNum = String(binding.DisconnectActivity_Nav.ActivityNum) + String(binding.DisconnectActivity_Nav.DocNum);
        binding = binding.DisconnectActivity_Nav.WOHeader_Nav.OrderISULinks[0];
    }
    context.getClientData().binding = binding;
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [],'$expand=Device_Nav/DeviceCategory_Nav/Material_Nav,DeviceLocation_Nav/Premise_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderISULinks,Workorder_Nav/OrderMobileStatus_Nav').then(function(orderISULink) {
        if (orderISULink.getItem(0)) {
            let isulink = orderISULink.getItem(0);
            if (baseBinding['@odata.type'] !== '#sap_mobile.OrderISULink') {
                isulink.DisconnectObject_Nav = baseBinding;
                isulink.DisconnectActivity_Nav = baseBinding.DisconnectActivity_Nav;
                isulink.Device_Nav = baseBinding.Device_Nav;
            }
            isulink.BatchEquipmentNum = batchEquipNum;
            if (binding.ISUProcess.startsWith('REP_INST')) {
                for (let i in isulink.Workorder_Nav.OrderISULinks) {
                    if (isulink.Workorder_Nav.OrderISULinks[i].ISUProcess.startsWith('REPLACE')) {
                        isulink.BatchEquipmentNum = isulink.Workorder_Nav.OrderISULinks[i].EquipmentNum;
                        break;
                    }
                }
            }

            isulink.DeviceLink = isulink.Device_Nav;
            if (!isulink.DeviceLink) {
                isulink.DeviceLink = baseBinding.Device_Nav;
            }
            if (libMeter.isLocal(isulink.Device_Nav)) {
                libMeter.setMeterTransactionType(context, isulink.ISUProcess + '_EDIT');
            } else {
                libMeter.setMeterTransactionType(context, isulink.ISUProcess);
            }
            context.setActionBinding(isulink);
        }
        const generator = new DynamicPageGenerator(context, null, sectionData, pageOverrides);
        return generator.navToPage();
    }).catch(() => {
        let readlink = "OrderISULinks(DisconnectionNum='" + binding.DisconnectionNum + "',DeviceLocation='" + binding.DeviceLocation + "',DeviceCategory='" + binding.DeviceCategory + "',ConnectionObject='" + binding.ConnectionObject + "',EquipmentNum='" + binding.EquipmentNum + "',SerialNum='" + binding.SerialNum + "',Premise='" + binding.Premise + "',OrderNum='" + binding.OrderNum + "',Installation='" + binding.Installation + "',ISUProcess='" + binding.ISUProcess + "',FunctionalLoc='" + binding.FunctionalLoc + "')";
        return context.read('/SAPAssetManager/Services/AssetManager.service', readlink, [],'$expand=Device_Nav/DeviceCategory_Nav/Material_Nav,DeviceLocation_Nav/Premise_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderISULinks,Workorder_Nav/OrderMobileStatus_Nav').then(function(orderISULink) {
            if (orderISULink.getItem(0)) {
                let isulink = orderISULink.getItem(0);
                isulink.BatchEquipmentNum = baseBinding.EquipmentNum;
                isulink.DeviceLink = isulink.Device_Nav;
                if (libMeter.isLocal(isulink.Device_Nav)) {
                    libMeter.setMeterTransactionType(context, isulink.ISUProcess + '_EDIT');
                } else {
                    libMeter.setMeterTransactionType(context, isulink.ISUProcess);
                }
                context.setActionBinding(isulink);
            }
            const generator = new DynamicPageGenerator(context, null, sectionData, pageOverrides);
            return generator.navToPage();
        });
    });
}
