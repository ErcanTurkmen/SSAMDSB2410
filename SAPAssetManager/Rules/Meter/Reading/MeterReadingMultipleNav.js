import {DynamicPageGenerator} from '../../FDC/DynamicPageGenerator';

export default function MeterReadingMultipleNav(context) {
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
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=Device_Nav/DeviceCategory_Nav,Device_Nav/Equipment_Nav').then(function(result) {
        let binding = result.getItem(0);
        binding.ErrorObject = context.binding.ErrorObject;
        binding.BatchEquipmentNum = context.binding.EquipmentNum;
        binding.DeviceLink = binding.Device_Nav;
        binding.FromSingleRegister = context.binding.Register;

        for (let obj of context.binding.ErrorObject.CustomHeaders) {
            if (obj.Name === 'OfflineOData.TransactionID') {
                binding.BatchEquipmentNum = obj.Value;
            }
        }

        context.setActionBinding(binding);
        const generator = new DynamicPageGenerator(context, null, sectionData, pageOverrides);
        return generator.navToPage();
    });
}
