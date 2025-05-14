import libCom from '../Common/Library/CommonLibrary';
import { DynamicPageGenerator } from '../FDC/DynamicPageGenerator';
import isWindows from '../Common/IsWindows';

export default function InspectionCharacteristicsDynamicPageNav(context) {
    const sectionData = [{
        '_Type': 'Section.Type.FormCell',
        '_Name': 'FormCellSection',
        'Target': {
            'EntitySet': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsUpdateEntitySet.js',
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsUpdateQueryOptions.js',
        },
        'Controls': [
            {
                'Caption': '$(L,title)',
                'Value': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsShortDesc.js',
                'IsEditable': false,
                '_Name': 'ShortDesc',
                '_Type': 'Control.Type.FormCell.Title',
                'IsVisible': '/SAPAssetManager/Rules/WorkOrders/InspectionLot/IsInspectionLotEnabled.js',
            },
            {
                'Caption': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsTargetSpecificationCaption.js',
                'IsEditable': false,
                'Value': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsTargetSpecification.js',
                '_Name': 'TargetSpecification',
                '_Type': 'Control.Type.FormCell.SimpleProperty',
                'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeOrCalCulatedIsVisible.js',
            },
            {
                'Caption': '{{#Property:ShortDesc}}',
                'IsEditable': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeIsEditable.js',
                'Value': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeInitialValue.js',
                'PlaceHolder': '$(L,value)',
                '_Name': 'QuantitativeValue',
                '_Type': 'Control.Type.FormCell.SimpleProperty',
                'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeOrCalCulatedIsVisible.js',
                'OnValueChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeOnValueChange.js',
                'KeyboardType': '/SAPAssetManager/Rules/Common/SetDateTimeKeyboardTypeIphone.js',
            },
            {
                'Caption': '{{#Property:ShortDesc}}',
                'Value': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeInitialValue.js',
                'Segments': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsInspectionCodesPickerItems.js',
                'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeSegmentIsVisible.js',
                'OnValueChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeOnChange.js',
                '_Name': 'QualitativeValueSegment',
                '_Type': 'Control.Type.FormCell.SegmentedControl',
                'IsEditable': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeIsEditable.js',
            },
            {
                'AllowMultipleSelection': false,
                'IsPickerDismissedOnSelection': true,
                'IsSearchCancelledAfterSelection': true,
                'Search': {
                    'Enabled': true,
                    'Delay': 500,
                    'MinimumCharacterThreshold': 3,
                    'Placeholder': '$(L,search)',
                    'BarcodeScanner': true,
                },
                'Caption': '{{#Property:ShortDesc}}',
                'IsEditable': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeIsEditable.js',
                'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeIsVisible.js',
                'Value': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeInitialValue.js',
                'PickerItems': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsInspectionCodesPickerItems.js',
                'OnValueChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeOnChange.js',
                '_Name': 'QualitativeValue',
                '_Type': 'Control.Type.FormCell.ListPicker',
            },
            {
                'AllowMultipleSelection': false,
                'IsPickerDismissedOnSelection': true,
                'IsSearchCancelledAfterSelection': true,
                'Search': {
                    'Enabled': true,
                    'Delay': 500,
                    'MinimumCharacterThreshold': 3,
                    'Placeholder': '$(L,search)',
                    'BarcodeScanner': true,
                },
                'Caption': '$(L,valuation)',
                'Value': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsValuationInitialValue.js',
                'Styles': {
                    'Value': '/SAPAssetManager/Rules/InspectionCharacteristics/ValuationStyle.js',
                },
                'PickerItems': {
                    'DisplayValue' : '{{#Property:ShortText}}',
                    'ReturnValue' : '{@odata.readLink}',
                    'Target':
                    {
                        'EntitySet' : 'InspectionResultValuations',
                        'Service' : '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions' : '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsValuationQueryOptions.js',
                    },
                },
                'OnValueChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsValuationCodeOnChange.js',
                '_Name': 'Valuation',
                '_Type': 'Control.Type.FormCell.ListPicker',
            },
            {
                'Caption': '$(L, note)',
                'PlaceHolder': '$(L,note)',
                '_Name': 'LongTextNote',
                '_Type': 'Control.Type.FormCell.Note',
                'IsAutoResizing': true,
                'Value': '{{#Property:MasterInspCharLongText_Nav/#Property:TextString}}',
                'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsLongTextIsAvailable.js',
                'IsEditable': false,
            },
        ],
    },
    {
        '_Type': 'Section.Type.FormCell',
        '_Name': 'FormCellSection',
        'Controls': [
            {
                'Title': '$(L,validate_all)',
                'OnPress': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsFDCValidateAll.js',
                'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/IsValidateAllButtonVisible.js',
                '_Type': 'Control.Type.FormCell.Button',
                'ButtonType': 'Button',
                '_Name': 'ValidateAllButton',
                'TextAlignment': '/SAPAssetManager/Rules/Common/Platform/ModalButtonAlign.js',
            },
        ],
    },
    {
        '_Type': 'Section.Type.FormCell',
        '_Name': 'FormCellSection',
        'Controls': [
            {
               '_Name': 'Attachment',
               '_Type': 'Control.Type.FormCell.Attachment',
               'AttachmentTitle': '$(L,attached_files)',
               'AttachmentAddTitle': '$(L,add)',
               'AttachmentCancelTitle': '$(L,cancel)',
               'AttachmentActionType': ['AddPhoto', 'TakePhoto', 'SelectFile'],
               'AllowedFileTypes': [],
               'IsVisible': '/SAPAssetManager/Rules/Documents/DocumentsIsVisible.js',
               'Value': '/SAPAssetManager/Rules/InspectionCharacteristics/InspectionCharacteristicsAttachments.js',
               'OnPress': '/SAPAssetManager/Rules/Documents/DocumentEditorAttachmentOnPress.js',
               'OnValueChange': '/SAPAssetManager/Rules/Documents/DocumentEditorAttachmentOnValueChange.js',
            },
        ],
    }];

    const pageOverrides = {
        'Caption': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsCount.js',
        'OnLoaded': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsOnLoaded.js',
        'OnReturning': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsOnReturning.js',
        'OnActivityBackPressed': '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/CancelCheckOnBackNavAndroid.js',
        'ActionBar': {
            'Items': [{
                'Position': 'left',
                'SystemItem': 'Cancel',
                'Caption': '$(L,cancel)',
                'OnPress': '/SAPAssetManager/Rules/Common/CheckForChangesBeforeClose.js',
            },
            {
                'Position': 'right',
                '_Name': 'Add',
                'SystemItem': 'Add',
                'Caption': '$(L,add)',
                'OnPress': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/AddAttachmentsNav.js',
                'Visible': '/SAPAssetManager/Rules/Documents/DocumentsIsVisible.js',
            },
            {
                'Position': 'right',
                'Icon': '$(PLT,\'\',/SAPAssetManager/Images/filter.android.png,\'\',/SAPAssetManager/Images/filter.android.png)',
                'Caption': '/SAPAssetManager/Rules/Filter/FilterButtonCaption.js',
                'OnPress': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsFDCFilter.js',
            },
            {
                'Position': 'right',
                'SystemItem': '$(PLT,\'Done\',\'\',\'\',\'Done\')',
                'Text': '/SAPAssetManager/Rules/Common/Platform/DoneText.js',
                'OnPress': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsFDCUpdateDone.js',
            }],
        },
    };
    if (isWindows(context)) {
        sectionData[0].Controls.push(            {
            'Title': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsValidateOrCalculateTitle.js',
            'OnPress': {
                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'InspectionCharacteristics(InspectionLot=\'{InspectionLot}\',InspectionNode=\'{InspectionNode}\',InspectionChar=\'{InspectionChar}\',SampleNum=\'{SampleNum}\')',
                    },
                    'OnSuccess': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsOnValidateOrCalculate.js',
                },
            },
            '_Name': 'ValidateOrCalculateButtonTablet',
            '_Type': 'Control.Type.FormCell.Button',
            'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsButtonStackIsVisible.js',
            'IsEditable': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsValidateOrCalculateIsEditable.js',
        },
        {
            'Title': '$(L,record_defect)',
            'OnPress': {
                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'InspectionCharacteristics(InspectionLot=\'{InspectionLot}\',InspectionNode=\'{InspectionNode}\',InspectionChar=\'{InspectionChar}\',SampleNum=\'{SampleNum}\')',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsRecordDefectQueryOptions.js',
                    },
                    'OnSuccess': '/SAPAssetManager/Rules/InspectionCharacteristics/InspectionCharacteristicsNotificationCreateNav.js',
                },
            },
            '_Name': 'RecordDefectsButtonTablet',
            '_Type': 'Control.Type.FormCell.Button',
            'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsButtonStackIsVisible.js',
            'IsEditable': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsRecordDefectIsVisible.js',
        },
        {
            'Title': '$(L,more_information)',
            'OnPress': {
                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'InspectionCharacteristics(InspectionLot=\'{InspectionLot}\',InspectionNode=\'{InspectionNode}\',InspectionChar=\'{InspectionChar}\',SampleNum=\'{SampleNum}\')',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsRecordDefectQueryOptions.js',
                    },
                    'OnSuccess': '/SAPAssetManager/Rules/InspectionCharacteristics/InspectionCharacteristicsDetailsNav.js',
                },
            },
            '_Name': 'MoreInformationButtonTablet',
            'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsButtonStackIsVisible.js',
            '_Type': 'Control.Type.FormCell.Button',
            'IsEditable': true,
        },
        {
            'Title': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsValidateOrCalculateTitle.js',
            'OnPress': {
                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'InspectionCharacteristics(InspectionLot=\'{InspectionLot}\',InspectionNode=\'{InspectionNode}\',InspectionChar=\'{InspectionChar}\',SampleNum=\'{SampleNum}\')',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsRecordDefectQueryOptions.js',
                    },
                    'OnSuccess': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsOnValidateOrCalculate.js',
                },
            },
            '_Name': 'ValidateOrCalculateButton',
            '_Type': 'Control.Type.FormCell.Button',
            'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsIndividualButtonIsVisible.js',
            'IsEditable': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsValidateOrCalculateIsEditable.js',
        },
        {
            'Title': '$(L,record_defect)',
            'OnPress': {
                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'InspectionCharacteristics(InspectionLot=\'{InspectionLot}\',InspectionNode=\'{InspectionNode}\',InspectionChar=\'{InspectionChar}\',SampleNum=\'{SampleNum}\')',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsRecordDefectQueryOptions.js',
                    },
                    'OnSuccess': '/SAPAssetManager/Rules/InspectionCharacteristics/InspectionCharacteristicsNotificationCreateNav.js',
                },
            },
            '_Name': 'RecordDefectsButton',
            '_Type': 'Control.Type.FormCell.Button',
            'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsIndividualButtonIsVisible.js',
            'IsEditable': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsRecordDefectIsVisible.js',
        },
        {
            'Caption': '$(L, comment)',
            'PlaceHolder': '$(L, comment)',
            '_Name': 'ShortTextComment',
            '_Type': 'Control.Type.FormCell.Note',
            'IsAutoResizing': true,
            'Value': '{Remarks}',
            'OnValueChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsCommentOnChange.js',
            'IsEditable': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsCommentIsEditable.js',
        });
    } else {
        sectionData[0].Controls.push(
            {
                '_Type': 'Control.Type.FormCell.Extension',
                '_Name': 'MyExtensionControlName',
                'Module': 'ButtonStackModule',
                'Control': 'ButtonStackExtension',
                'Class': 'ButtonStackClass',
                'Height': 60,
                'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsButtonStackIsVisible.js',
                'ExtensionProperties': {
                    'Buttons': [
                        {
                            'Title': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsValidateOrCalculateTitle.js',
                            'OnPress': {
                                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                                'Properties': {
                                    'Target': {
                                        'EntitySet': 'InspectionCharacteristics(InspectionLot=\'{InspectionLot}\',InspectionNode=\'{InspectionNode}\',InspectionChar=\'{InspectionChar}\',SampleNum=\'{SampleNum}\')',
                                        'QueryOptions': '$expand=InspCharDependency_Nav',
                                    },
                                    'OnSuccess': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsOnValidateOrCalculate.js',
                                },
                            },
                            '_Name': 'ValidateOrCalculateButtonTablet',
                            'IsEditable': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsValidateOrCalculateIsEditable.js',
                        },
                        {
                            'Title': '$(L,record_defect)',
                            'OnPress': {
                                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                                'Properties': {
                                    'Target': {
                                        'EntitySet': 'InspectionCharacteristics(InspectionLot=\'{InspectionLot}\',InspectionNode=\'{InspectionNode}\',InspectionChar=\'{InspectionChar}\',SampleNum=\'{SampleNum}\')',
                                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                                        'QueryOptions': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsRecordDefectQueryOptions.js',
                                    },
                                    'OnSuccess': '/SAPAssetManager/Rules/InspectionCharacteristics/InspectionCharacteristicsNotificationCreateNav.js',
                                },
                            },
                            '_Name': 'RecordDefectsButtonTablet',
                            'IsEditable': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsRecordDefectIsVisible.js',
                        },
                        {
                            'Title': '$(L,more_information)',
                            'OnPress': {
                                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                                'Properties': {
                                    'Target': {
                                        'EntitySet': 'InspectionCharacteristics(InspectionLot=\'{InspectionLot}\',InspectionNode=\'{InspectionNode}\',InspectionChar=\'{InspectionChar}\',SampleNum=\'{SampleNum}\')',
                                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                                        'QueryOptions': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsRecordDefectQueryOptions.js',
                                    },
                                    'OnSuccess': '/SAPAssetManager/Rules/InspectionCharacteristics/InspectionCharacteristicsDetailsNav.js',
                                },
                            },
                            '_Name': 'MoreInformationButtonTablet',
                            'IsEditable': true,
                        },
                    ],
                },
            },
            {
                '_Type': 'Control.Type.FormCell.Extension',
                '_Name': 'MyExtensionControlNameValidate',
                'Module': 'ButtonStackModule',
                'Control': 'ButtonStackExtension',
                'Class': 'ButtonStackClass',
                'Height': 44,
                'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsIndividualButtonIsVisible.js',
                'ExtensionProperties': {
                    'Buttons': [
                        {
                            'Title': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsValidateOrCalculateTitle.js',
                            'OnPress': {
                                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                                'Properties': {
                                    'Target': {
                                        'EntitySet': 'InspectionCharacteristics(InspectionLot=\'{InspectionLot}\',InspectionNode=\'{InspectionNode}\',InspectionChar=\'{InspectionChar}\',SampleNum=\'{SampleNum}\')',
                                        'QueryOptions': '$expand=InspCharDependency_Nav',
                                    },
                                    'OnSuccess': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsOnValidateOrCalculate.js',
                                },
                            },
                            '_Name': 'ValidateOrCalculateButton',
                            'IsEditable': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsValidateOrCalculateIsEditable.js',
                        },
                    ],
                },
            },
            {
                '_Type': 'Control.Type.FormCell.Extension',
                '_Name': 'MyExtensionControlNameRecordDefect',
                'Module': 'ButtonStackModule',
                'Control': 'ButtonStackExtension',
                'Class': 'ButtonStackClass',
                'Height': 44,
                'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsIndividualButtonIsVisible.js',
                'ExtensionProperties': {
                    'Buttons': [
                        {
                            'Title': '$(L,record_defect)',
                            'OnPress': {
                                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                                'Properties': {
                                    'Target': {
                                        'EntitySet': 'InspectionCharacteristics(InspectionLot=\'{InspectionLot}\',InspectionNode=\'{InspectionNode}\',InspectionChar=\'{InspectionChar}\',SampleNum=\'{SampleNum}\')',
                                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                                        'QueryOptions': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsRecordDefectQueryOptions.js',
                                    },
                                    'OnSuccess': '/SAPAssetManager/Rules/InspectionCharacteristics/InspectionCharacteristicsNotificationCreateNav.js',
                                },
                            },
                            '_Name': 'RecordDefectsButton',
                            'IsEditable': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsRecordDefectIsVisible.js',
                        },
                    ],
                },
            },
            {
                '_Type': 'Control.Type.FormCell.Extension',
                '_Name': 'MyExtensionControlNameInspectionMethod',
                'Module': 'ButtonStackModule',
                'Control': 'ButtonStackExtension',
                'Class': 'ButtonStackClass',
                'Height': 44,
                'IsVisible': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsIndividualButtonIsVisible.js',
                'ExtensionProperties': {
                    'Buttons': [
                        {
                            'Title': '$(L,more_information)',
                            'OnPress': {
                                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                                'Properties': {
                                    'Target': {
                                        'EntitySet': 'InspectionCharacteristics(InspectionLot=\'{InspectionLot}\',InspectionNode=\'{InspectionNode}\',InspectionChar=\'{InspectionChar}\',SampleNum=\'{SampleNum}\')',
                                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                                        'QueryOptions': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsRecordDefectQueryOptions.js',
                                    },
                                    'OnSuccess': '/SAPAssetManager/Rules/InspectionCharacteristics/InspectionCharacteristicsDetailsNav.js',
                                },
                            },
                            '_Name': 'MoreInformationButton',
                            'IsEditable': true,
                        },
                    ],
                },
            },
            {
                'Caption': '$(L, comment)',
                'PlaceHolder': '$(L, comment)',
                '_Name': 'ShortTextComment',
                '_Type': 'Control.Type.FormCell.Note',
                'IsAutoResizing': true,
                'Value': '{Remarks}',
                'OnValueChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsCommentOnChange.js',
                'IsEditable': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsCommentIsEditable.js',
            },
        );
    }
    
    libCom.setStateVariable(context, 'FDCPreviousPage', context.evaluateTargetPathForAPI('#Page:-Current')._page.definition.name);
    libCom.setStateVariable(context, 'FDCPreviousPageBinding', context.evaluateTargetPathForAPI('#Page:-Current').binding);
    if (context.getPageProxy().getActionBinding()) {
        context.getPageProxy().evaluateTargetPathForAPI('#Page:' + context.evaluateTargetPathForAPI('#Page:-Current')._page.definition.name).getClientData().ActionBinding = context.getPageProxy().getActionBinding();
    } else {
        context.getPageProxy().evaluateTargetPathForAPI('#Page:' + context.evaluateTargetPathForAPI('#Page:-Current')._page.definition.name).getClientData().ActionBinding = '';
    }
    let generator = new DynamicPageGenerator(context, null, sectionData, pageOverrides, {'ModalPageFullscreen': true});
    return generator.navToPage();
}
