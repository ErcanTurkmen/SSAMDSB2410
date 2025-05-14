import libCom from '../../../Common/Library/CommonLibrary';
import { DynamicPageGenerator } from '../../../FDC/DynamicPageGenerator';

export default function InspectionPointsDynamicPageNav(context) {
    const sectionData = [{
        '_Type': 'Section.Type.FormCell',
        '_Name': 'FormCellSection',
        'Target': {
            'EntitySet': '/SAPAssetManager/Rules/WorkOrders/Operations/InspectionPoints/InspectionPointUpdateEntitySet.js',
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '$expand=WOOperation_Nav/WOHeader,InspCode_Nav,InspValuation_Nav,Equip_Nav,FuncLoc_Nav,InspectionChar_Nav&$orderby=InspectionNode',
        },
        'Controls': [
            {
                'Caption': '/SAPAssetManager/Rules/WorkOrders/Operations/InspectionPoints/InspectionPointTechnicalObjectTitle.js',
                'Value': '/SAPAssetManager/Rules/WorkOrders/Operations/InspectionPoints/InspectionPointTechnicalObjectDesc.js',
                'IsEditable': false,
                '_Name': 'ShortDesc',
                '_Type': 'Control.Type.FormCell.Title',
                'IsVisible': true,
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
                'Caption': '$(L,valuation_proposal)',
                'IsEditable': true,
                'Value': '/SAPAssetManager/Rules/WorkOrders/Operations/InspectionPoints/InspectionPointsInspectionCodeInitialValue.js',
                'PickerItems': '/SAPAssetManager/Rules/WorkOrders/InspectionLot/SetUsage/InspectionLotSetUsageInspectionCodesPickerItems.js',
                '_Name': 'Valuation',
                '_Type': 'Control.Type.FormCell.ListPicker',
                'OnValueChange': '/SAPAssetManager/Rules/WorkOrders/Operations/InspectionPoints/InspectionPointSetValuation.js',
            },
            {
                'Title': '$(L,review)',
                '_Type': 'Control.Type.FormCell.Button',
                '_Name': 'ReviewButton',
                'OnPress': {
                    'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                    'Properties': {
                        'Target': {
                            'EntitySet': 'InspectionPoints(InspectionLot=\'{InspectionLot}\',InspectionNode=\'{InspectionNode}\',SampleNum=\'{SampleNum}\')',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': '$expand=InspectionChar_Nav',
                        },
                        'OnSuccess': '/SAPAssetManager/Rules/WorkOrders/Operations/InspectionPoints/InspectionPointReviewCharacteristics.js',
                    },
                },
            },
        ],
    }];

    const pageOverrides = {
        'Caption': '$(L,valuation)',
        'OnLoaded': '/SAPAssetManager/Rules/WorkOrders/Operations/InspectionPoints/InspectionPointsOnLoaded.js',
        'OnActivityBackPressed': '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/CancelCheckOnBackNavAndroid.js',
        'ActionBar': {
            'Items': [
                {
                    'Position': 'left',
                    'SystemItem': 'Cancel',
                    'Caption': '$(L,cancel)',
                    'OnPress': '/SAPAssetManager/Rules/Common/CheckForChangesBeforeClose.js',
                },
                {
                    'Position': 'right',
                    'SystemItem': '$(PLT,\'Done\',\'\',\'\',\'Done\')',
                    'Text': '/SAPAssetManager/Rules/Common/Platform/DoneText.js',
                    'OnPress': '/SAPAssetManager/Rules/WorkOrders/Operations/InspectionPoints/InspectionPointsFDCUpdateDone.js',
                },
            ],
        },
    };
    let generator = new DynamicPageGenerator(context, null, sectionData, pageOverrides);
    generator.setPageName(libCom.getStateVariable(context, 'FDCPreviousPage'));
    return generator.navToPage();
}
