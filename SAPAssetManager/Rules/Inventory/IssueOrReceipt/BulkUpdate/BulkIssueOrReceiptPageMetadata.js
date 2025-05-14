import deviceType from '../../../Common/DeviceType';

export function GetItemSearchAndSelectSection(context, config) {
    if (deviceType(context) === 'Phone') {
        return GetItemSearchAndSelectSectionPhone(config);
    }
    return GetItemSearchAndSelectSectionTablet(config);
}

export function GetItemTitleDescriptionSection(context, config, properties) {
    if (deviceType(context) === 'Phone') {
        return GetItemTitleDescriptionSectionPhone(config, properties);
    }
    return GetItemTitleDescriptionSectionTablet(config, properties);
}

export function GetItemEDTSection(config, properties) {
    return {
        'Header': {
            'UseTopPadding': false,
        },
        'Footer': {
            'UseBottomPadding': false,
        },
        'Separators': {
            'TopSectionSeparator': false,
            'BottomSectionSeparator': true,
            'HeaderSeparator': false,
            'FooterSeparator': false,
            'ControlSeparator': false,
        },
        'Module': 'extension-EditableDataTable',
        'Control': 'EditableDataTableViewExtension',
        'Class': 'EditableDataTableViewExtension',
        'Height': config.ItemEDTHeight,
        'ExtensionProperties': {
            'OnCellGetsFocus': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/BulkIssueOrReceiptOnCellGetsFocus.js',
            'OnCellLostFocus': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/BulkIssueOrReceiptOnCellLostFocus.js',
            'OnLoaded': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOrReceiptCreateOnLoaded.js',
            'Configuration': {
                'IsStickyHeaderRow': true,
                'NumberOfLeadingStickyColumns': 0,
                'MaxLinesPerRow': 1,
                'IsHeaderRowVisible': false,
            },
            'Columns': properties.columns,
            'Row': {
                'Items': properties.items,
            },
            'Target': {
                'EntitySet': 'MaterialDocItems',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'QueryOptions': properties.QueryOptions,
            },
        },
        '_Type': 'Section.Type.Extension',
        '_Name': 'EditableDataTableExtensionSection1',
    };
}

export function GetEDTColumns(config) {
    let columns = [
        {
            'HeaderName': 'ItemSelection',
            'PreferredWidth': config.ItemEDTColWidth.switch,
        },
        {
            'HeaderName': 'StorageLocation',
            'PreferredWidth': config.ItemEDTColWidth.sloc,		
        },
        {
            'HeaderName': 'Quantity',
            'PreferredWidth': config.ItemEDTColWidth.qty,
        },
        {
            'HeaderName': 'UOM',
            'PreferredWidth': config.ItemEDTColWidth.uom,				
        },
        {
            'HeaderName': 'DetailsButton',
            'PreferredWidth': config.ItemEDTColWidth.btn,
            'IsDynamicWidth': true,					
        },
    ];
    return columns;
}

export function GetEDTItems() {
    let items = 
    [
        {
            'Type': 'Switch',
            'Name': 'ItemSelection',
            'IsMandatory': false,
            'IsReadOnly': false,
            'OnValueChange': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/BulkIssueOrReceiptOnSwitchValueChanged.js',
            'Property': 'ItemSelection',
            'Parameters': {
                'Value': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/BulkIssueOrReceiptSwitchValue.js',
            },
        },
        {
            'Type': 'ListPicker',
            'Name': 'StorageLocation',
            'IsMandatory': true,
            'IsReadOnly': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/BulkUpdate/EDT/IsStorageLocationReadOnly.js',
            'Property': 'StorageLocation',
            'Parameters': {
                'Search': {
                    'Enabled': true,
                    'Delay': 500,
                    'MinimumCharacterThreshold': 3,
                    'Placeholder': '$(L,search)',
                    'BarcodeScanner': true,
                },
                'ItemsPerPage': 21,
                'CachedItemsToLoad': 2,
                'Caption': '$(L,storage_location)',
                'DisplayValue': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/GetStorageLocation.js',
                'Value': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/GetStorageLocation.js',
                'PickerItems': {
                    'DisplayValue': '{StorageLocation} - {StorageLocationDesc}',
                    'ReturnValue': '{StorageLocation}',
                    'Target': {
                        'EntitySet': 'StorageLocations',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/StorageLocationQuery.js',
                    },
                },
            },
        },
        {
            'Type': 'Number',
            'Name': 'Quantity',
            'IsMandatory': false,
            'IsReadOnly': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/BulkUpdate/EDT/IsQuantityReadOnly.js',
            'Property': 'Quantity',
            'OnValueChange': '',
            'Parameters': {
                'Value': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/GetReceivedQuantity.js',
            },
        },
        {
            'Type': 'ListPicker',
            'Name': 'UOM',
            'IsMandatory': false,
            'IsReadOnly': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/BulkUpdate/EDT/IsUoMReadOnly.js',
            'Property': 'UOM',
            'Parameters': {
                'Search': {
                    'Enabled': true,
                    'Delay': 500,
                    'MinimumCharacterThreshold': 1,
                    'Placeholder': '$(L,search)',
                    'BarcodeScanner': true,
                },
                'ItemsPerPage': 21,
                'CachedItemsToLoad': 2,
                'Caption': '$(L,uom)',
                'Value': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/GetUOM.js',
                'PickerItems': {
                    'DisplayValue': '{UOM} - {BaseUOM}',
                    'ReturnValue': '{UOM}',
                    'Target': {
                        'EntitySet': 'MaterialUOMs',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': '/SAPAssetManager/Rules/Inventory/Validation/UOMListPickerQueryOptions.js',
                    },
                },
            },
        },
        {
            'Type': 'Button',
            'Name': 'DetailsButton',
            'IsMandatory': false,
            'IsReadOnly': false,
            'OnValueChange': '',
            'Property': 'DetailsPageButton',
            'Parameters': {
                'Icon': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/ShowAccessoryButtonIcon.js',
                'Action': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/BulkUpdate/IssueOrReceiptItemNav.js',
                'Style': 'Secondary',
            },
        },
    ];
    return items;
}

function GetItemTitleDescriptionSectionPhone(config, properties) {
    return { 
        'Header': {
            'UseTopPadding': false,
        },
        'Footer': {
            'UseBottomPadding': false,
        },
        'Separators': {
            'TopSectionSeparator': false,
            'BottomSectionSeparator': false,
            'HeaderSeparator': false,
            'FooterSeparator': false,
            'ControlSeparator': false,
        },
        'Layout': {
            'NumberOfColumns': 1,
        },
        'Extension': {
            'Module': 'HeaderDescriptionModule',
            'Control': 'HeaderDescriptionExtension',
            'Class': 'HeaderDescriptionClass',
            'Height': config.ItemHeaderHeight,
            'ExtensionProperties': {
                'Title': properties.Title,
                'Description': properties.Description,
            },
            'OnPress': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/BulkIssueOrReceiptOnCellLostFocus.js',
        },
        'Target': {
            'EntitySet': 'MaterialDocItems',
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '$top=1',
        },
        '_Type': 'Section.Type.ObjectCollection',
        '_Name': 'HeaderDescriptionExtensionSection',
    };
}

function GetItemTitleDescriptionSectionTablet(config, properties) {
    return {
        'Header': {
            'UseTopPadding': false,
        },
        'Footer': {
            'UseBottomPadding': false,
        },
        'Separators': {
            'TopSectionSeparator': false,
            'BottomSectionSeparator': false,
            'HeaderSeparator': false,
            'FooterSeparator': false,
            'ControlSeparator': false,
        },
        'Module': 'HeaderDescriptionModule',
        'Control': 'HeaderDescriptionExtension',
        'Class': 'HeaderDescriptionClass',
        'Height': config.ItemHeaderHeight,
        'ExtensionProperties': {
            'Title': properties.Title,
            'Description': properties.Description,
        },
        'Target': {
            'EntitySet': 'MaterialDocItems',
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '$top=1',
        },
        '_Type': 'Section.Type.Extension',
        '_Name': 'HeaderDescriptionExtensionSection',
    };
}

function GetItemSearchAndSelectSectionPhone(config) {
    return {
        'Header': {
            'UseTopPadding': false,
        },
        'Footer': {
            'UseBottomPadding': false,
        },
        'Separators': {
            'TopSectionSeparator': false,
            'BottomSectionSeparator': true,
            'HeaderSeparator': false,
            'FooterSeparator': false,
            'ControlSeparator': false,
        },
        '_Type': 'Section.Type.ObjectCollection',
        'Layout': {
            'NumberOfColumns': 1,
        },
        'Extension': {
            '_Name': 'SelectAll',
            'Module': 'LabelButtonModule',
            'Control': 'LabelButtonExtension',
            'Class': 'LabelButtonClass',
            'Height': config.SelectAllHeight,
            'ExtensionProperties': {
                'Label': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/BulkUpdate/GetAllCaption.js',
                'Button': {
                    'Title': '$(L, deselect_all)',
                    'ToggleValue': true,
                    'OnPress': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/SelectDeselectAllBulkIssueOrReceiptItems.js',
                },
            },
        },
        'Target': {
            'EntitySet': 'MaterialDocuments',
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '$top=1',
        },
    };
}

function GetItemSearchAndSelectSectionTablet(config) {
    return {
        'Header': {
            'UseTopPadding': false,
        },
        'Footer': {
            'UseBottomPadding': false,
        },
        'Separators': {
            'TopSectionSeparator': false,
            'BottomSectionSeparator': true,
            'HeaderSeparator': false,
            'FooterSeparator': false,
            'ControlSeparator': false,
        },
        'Module': 'LabelButtonModule',
        'Control': 'LabelButtonExtension',
        'Class': 'LabelButtonClass',
        'Height': config.SelectAllHeight,
        'ExtensionProperties': {
            'Label': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/BulkUpdate/GetAllCaption.js',
            'Button': {
                'Title': '$(L, deselect_all)',
                'ToggleValue': true,
                'OnPress': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/SelectDeselectAllBulkIssueOrReceiptItems.js',
            },
        },
        'Target': {
            'EntitySet': 'MaterialDocuments',
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '$top=1',
        },
        '_Type': 'Section.Type.Extension',
        '_Name': 'HeaderDescriptionExtensionSection',
    };
}
