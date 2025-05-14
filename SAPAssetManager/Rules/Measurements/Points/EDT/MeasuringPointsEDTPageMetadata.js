import IsS4ServiceIntegrationEnabled from '../../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import MeasuringPointSkipVisible from '../MeasuringPointSkipVisible';
import EDTHelper from './MeasuringPointsEDTHelper';

export function GetMeasuringPointsActionBarItems() {
    return [
        {
            'Position': 'left',
            'Caption': '$(L, cancel)',
            'SystemItem': 'Cancel',
            'OnPress': '/SAPAssetManager/Rules/Common/CheckForChangesBeforeCancel.js',
        },
        {
            'Position': 'right',
            'Caption': '$(L, filter)',
            'SystemItem': '/SAPAssetManager/Rules/Filter/FilterSystemItem.js',
            'OnPress': '/SAPAssetManager/Actions/Measurements/MeasuringPointsFiltersEDTPageNav.action',
        },
        {
            'Position': 'right',
            'SystemItem': '$(PLT,\'Done\',\'\',\'\',\'Done\')',
            '_Name': 'SaveButton',
            'Text': '/SAPAssetManager/Rules/Common/Platform/DoneText.js',
            'OnPress': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnSave.js',
        },
    ];
}

export function GetMeasuringPointsKPI() {
    return {
        '_Type': 'Section.Type.KPIHeader',
        '_Name': 'KPIHeader',
        'Visible': true,
        'KPIHeader': {
            'KPIItems': [
                {
                    'MetricItems': [
                        {
                            'Value':'/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/MeasuringPointsEDTKPIValue.js',
                        },
                    ],
                    'CaptionLabel': '$(L, kpi_completed)',
                },
            ],
        },
    };
}

export function GetHeaderSection(config, height, properties = {}) {
    return {
        'Module': 'extension-SectionHeader',
        'Control': 'SectionHeaderViewExtension',
        'Class': 'SectionHeaderViewExtension',
        'Height': height,
        'Footer': {
            'UseBottomPadding': false,
        },
        'ExtensionProperties': {
            'UserData': {
                'Index': config.sectionIndex,
            },
            'HeadlineText': properties.headlineText,
            'BodyText': properties.bodyText,
            'Footnote': properties.footnote,
            'StatusText': properties.statusText,
            'Buttons': [],
        },
        '_Type': 'Section.Type.Extension',
        '_Name': 'SectionHeaderExtensionSection',
    };
}

export function GetEDTSection(config, properties) {
    return {
        'Module': 'extension-EditableDataTable',
        'Control': 'EditableDataTableViewExtension',
        'Class': 'EditableDataTableViewExtension',
        'Height': config.height,
        'Header': {
            'UseTopPadding': false,
        },
        'ExtensionProperties': {
            'OnCellGetsFocus': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsOnCellGetsFocus.js',
            'OnCellLostFocus': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsOnCellLostFocus.js',
            'OnLoaded': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnExtensionLoaded.js',
            'UserData': {
                'Index': config.sectionIndex,
                'Operations': config.operations,
            },
            'Configuration': {
                'IsStickyHeaderRow': true,
                'NumberOfLeadingStickyColumns': config.numberOfLeadingStickyColumns,
                'MaxLinesPerRow': 2,
            },
            'Columns': properties.columns,
            'Row': {
                'Items': properties.items,
            },
            'Target': {
                'EntitySet': properties.entityset,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'QueryOptions': properties.queryOptions,
            },
        },
        '_Type': 'Section.Type.Extension',
        '_Name': 'EditableDataTableExtensionSection',
    };
}

export function GetMeasuringPointsColumns(context, points, config) {
    let columns = [
        {
            'HeaderName': '$(L, point)',
            'PreferredWidth': 200,
        },
        {
            'HeaderName': '$(L, lower_limit)',
            'PreferredWidth': 170,
        },
        {
            'HeaderName': '$(L, upper_limit)',
            'PreferredWidth': 170,
        },
        {
            'HeaderName': '$(L, value)',
            'PreferredWidth': 200,
        },
        {
            'HeaderName': '$(L, unit_of_measure)',
            'PreferredWidth': 170,
        },
        {
            'HeaderName': '$(L,last_value)',
            'PreferredWidth': 170,
        },
        {
            'HeaderName': '$(L,note)',
            'PreferredWidth': 200,
        },
    ];

    if (EDTHelper.isOperationColumnVisible(context, points, config)) {
        if (IsS4ServiceIntegrationEnabled(context)) {
            columns.splice(3, 0, {
                'HeaderName': '$(L, items)',
                'PreferredWidth': 170,
            });
        } else {
            columns.splice(3, 0, {
                'HeaderName': '$(L, operation)',
                'PreferredWidth': 170,
            });
        }
    }

    if (EDTHelper.isValuationCodeColumnVisible(points)) {
        columns.splice(5, 0, {
            'HeaderName': '$(L, valuation_code)',
            'PreferredWidth': 170,
        });
    }

    if (MeasuringPointSkipVisible(context)) {
        columns.splice(1, 0, {
            'HeaderName': '$(L, skip)',
            'PreferredWidth': 170,
        });
    }

    return columns;
}

export function GetMeasuringPointsCells(context, points, config) {
    let cells = [
        {
            'Type': 'Text',
            'Name': 'Point',
            'IsMandatory': false,
            'IsReadOnly': true,
            'Property': 'Point',
            'OnValueChange': '',
            'Parameters': {
                'Value': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/MeasuringPointsEDTPointValue.js',
            },
        },
        {
            'Type': 'Text',
            'Name': 'LowerLimit',
            'IsMandatory': false,
            'IsReadOnly': true,
            'Property': 'LowerRange',
            'OnValueChange': '',
            'Parameters': {
                'Value': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/MeasuringPointsEDTLowerRangeValue.js',
            },
        },
        {
            'Type': 'Text',
            'Name': 'UpperLimit',
            'IsMandatory': false,
            'IsReadOnly': true,
            'Property': 'UpperRange',
            'OnValueChange': '',
            'Parameters': {
                'Value': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/MeasuringPointsEDTUpperRangeValue.js',
            },
        },
        '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/MeasuringPointsEDTValueControl.js',
        {
            'Type': 'Text',
            'Name': 'uom',
            'IsMandatory': false,
            'IsReadOnly': true,
            'Property': 'uom',
            'OnValueChange': '',
            'Parameters': {
                'Value': '/SAPAssetManager/Rules/Measurements/Points/MeasuringPointUOM.js',
            },
        },
        {
            'Type': 'Text',
            'Name': 'PrevReadingValue',
            'IsMandatory': false,
            'IsReadOnly': true,
            'Property': 'PrevReadingValue',
            'OnValueChange': '',
            'Parameters': {
                'Value': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/MeasuringPointsEDTPrevReadingValue.js',
            },
        },
        {
            'Type': 'Text',
            'Name': 'ShortTextNote',
            'IsMandatory': false,
            'IsReadOnly': false,
            'Property': 'ShortText',
            'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnValueChange.js',
            'Parameters': {
                'Value': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/MeasuringPointsEDTShortTextValue.js',
            },
        },
    ];

    if (EDTHelper.isOperationColumnVisible(context, points, config)) {
        cells.splice(3, 0, '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/MeasuringPointsEDTOperationControl.js');
    }

    if (EDTHelper.isValuationCodeColumnVisible(points)) {
        cells.splice(5, 0, '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/MeasuringPointsEDTValuationCodeControl.js');
    }

    if (MeasuringPointSkipVisible(context)) {
        cells.splice(1, 0, {
            'Type': 'Switch',
            'Name': 'Skip',
            'IsMandatory': false,
            'IsReadOnly': false,
            'Property': 'Skip',
            'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnSkipChange.js',
            'Parameters': {
                'Value': false,
            },
        });
    }

    return cells;
}

export function GetLAMColumns(points) {
    if (EDTHelper.isLamColumnsVisible(points)) {
        return [
            {
                'HeaderName': '$(L,lin_ref_pattern)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,start_point)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,end_point)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,calculate_length)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,length)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,uom)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,start_marker)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,distance_from_start)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,end_marker)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,distance_from_end)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,uom)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,offset1_type)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,offset1)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,offset1_uom)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,offset2_type)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,offset2)',
                'PreferredWidth': 200,
            },
            {
                'HeaderName': '$(L,offset2_uom)',
                'PreferredWidth': 200,
            },
        ];
    }

    return [];
}

export function GetLAMCells(clientAPI, points) {
    if (EDTHelper.isLamColumnsVisible(points)) {
        return [
            {
                'Type': 'Text',
                'Name': 'LinearReferencePatternId',
                'IsMandatory': false,
                'IsReadOnly': true,
                'Property': 'LRPId',
                'OnValueChange': '',
                'Parameters': {
                    'Value': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTLinearReferencePatternIdValue.js',
                },
            },
            '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTStartPointControl.js',
            '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTEndPointControl.js',
            {
                'Type': 'Button',
                'Name': 'CalculateLengthButton',
                'IsMandatory': false,
                'IsReadOnly': false,
                'Property': '',
                'Parameters': {
                    'Value': '$(L, calculate)',
                    'Action': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/MeasuringPointsEDTCalculateLength.js',
                    'Style': 'Secondary',
                },
            },
            '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTLengthControl.js',
            {
                'Type': 'ListPicker',
                'Name': 'UOM',
                'IsMandatory': true,
                'IsReadOnly': false,
                'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnValueChange.js',
                'Property': 'LAMObjectDatum_Nav/UOM',
                'Parameters': {
                    'Search': {
                        'Enabled': true,
                        'Delay': 500,
                        'MinimumCharacterThreshold': 3,
                        'Placeholder': clientAPI.localizeText('search'),
                        'BarcodeScanner': true,
                    },
                    'ItemsPerPage': 20,
                    'CachedItemsToLoad': 2,
                    'Caption': clientAPI.localizeText('uom'),
                    'DisplayValue': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTUomValue.js',
                    'Value': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTUomValue.js',
                    'PickerItems': {
                        'DisplayValue': '{UoM} - {Description}',
                        'ReturnValue': '{UoM}',
                        'Target': {
                            'EntitySet': 'UsageUoMs',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': "$filter=Dimension eq 'LENGTH'",
                        },
                    },
                },
            },
            {
                'Type': 'ListPicker',
                'Name': 'StartMarker',
                'IsMandatory': false,
                'IsReadOnly': false,
                'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTDistanceOnValueChange.js',
                'Property': 'LAMObjectDatum_Nav/StartMarker',
                'Parameters': {
                    'Search': {
                        'Enabled': true,
                        'Delay': 500,
                        'MinimumCharacterThreshold': 3,
                        'Placeholder': clientAPI.localizeText('search'),
                        'BarcodeScanner': true,
                    },
                    'ItemsPerPage': 20,
                    'CachedItemsToLoad': 2,
                    'Caption': clientAPI.localizeText('start_marker'),
                    'DisplayValue': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTStartMarkerValue.js',
                    'Value': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTStartMarkerValue.js',
                    'PickerItems': {
                        'DisplayValue': '{Marker}',
                        'ReturnValue': '{Marker}',
                        'Target': {
                            'EntitySet': 'LinearReferencePatternItems',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/MeasuringPointsEDTLamMarkerQueryOptions.js',
                        },
                    },
                },
            },
            '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTStartMarkerDistanceControl.js',
            {
                'Type': 'ListPicker',
                'Name': 'EndMarker',
                'IsMandatory': false,
                'IsReadOnly': false,
                'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTDistanceOnValueChange.js',
                'Property': 'LAMObjectDatum_Nav/EndMarker',
                'Parameters': {
                    'Search': {
                        'Enabled': true,
                        'Delay': 500,
                        'MinimumCharacterThreshold': 3,
                        'Placeholder': clientAPI.localizeText('search'),
                        'BarcodeScanner': true,
                    },
                    'ItemsPerPage': 20,
                    'CachedItemsToLoad': 2,
                    'Caption': clientAPI.localizeText('end_marker'),
                    'DisplayValue': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTEndMarkerValue.js',
                    'Value': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTEndMarkerValue.js',
                    'PickerItems': {
                        'DisplayValue': '{Marker}',
                        'ReturnValue': '{Marker}',
                        'Target': {
                            'EntitySet': 'LinearReferencePatternItems',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': '',
                        },
                    },
                },
            },
            '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTDistanceFromEndControl.js',
            {
                'Type': 'ListPicker',
                'Name': 'MarkerUOM',
                'IsMandatory': true,
                'IsReadOnly': false,
                'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnValueChange.js',
                'Property': 'LAMObjectDatum_Nav/MarkerUOM',
                'Parameters': {
                    'Search': {
                        'Enabled': true,
                        'Delay': 500,
                        'MinimumCharacterThreshold': 3,
                        'Placeholder': clientAPI.localizeText('search'),
                        'BarcodeScanner': true,
                    },
                    'ItemsPerPage': 20,
                    'CachedItemsToLoad': 2,
                    'Caption': clientAPI.localizeText('uom'),
                    'DisplayValue': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTMarkerUomValue.js',
                    'Value': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTMarkerUomValue.js',
                    'PickerItems': {
                        'DisplayValue': '{UoM} - {Description}',
                        'ReturnValue': '{UoM}',
                        'Target': {
                            'EntitySet': 'UsageUoMs',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': "$filter=Dimension eq 'LENGTH'",
                        },
                    },
                },
            },
            {
                'Type': 'ListPicker',
                'Name': 'Offset1Type',
                'IsMandatory': false,
                'IsReadOnly': false,
                'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnValueChange.js',
                'Property': 'LAMObjectDatum_Nav/Offset1Type',
                'Parameters': {
                    'Search': {
                        'Enabled': true,
                        'Delay': 500,
                        'MinimumCharacterThreshold': 3,
                        'Placeholder': clientAPI.localizeText('search'),
                        'BarcodeScanner': true,
                    },
                    'ItemsPerPage': 20,
                    'CachedItemsToLoad': 2,
                    'Caption': clientAPI.localizeText('offset1_type'),
                    'DisplayValue': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTOffset1TypeValue.js',
                    'Value': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTOffset1TypeValue.js',
                    'PickerItems': {
                        'DisplayValue': '{OffsetTypeCode} - {Description}',
                        'ReturnValue': '{OffsetTypeCode}',
                        'Target': {
                            'EntitySet': 'LAMOffsetTypes',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': '',
                        },
                    },
                },
            },
            '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTOffset1Control.js',
            {
                'Type': 'ListPicker',
                'Name': 'Offset1UOM',
                'IsMandatory': false,
                'IsReadOnly': false,
                'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnValueChange.js',
                'Property': 'LAMObjectDatum_Nav/Offset1UOM',
                'Parameters': {
                    'Search': {
                        'Enabled': true,
                        'Delay': 500,
                        'MinimumCharacterThreshold': 3,
                        'Placeholder': clientAPI.localizeText('search'),
                        'BarcodeScanner': true,
                    },
                    'ItemsPerPage': 20,
                    'CachedItemsToLoad': 2,
                    'Caption': clientAPI.localizeText('offset1_uom'),
                    'DisplayValue': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTOffset1UOMValue.js',
                    'Value': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTOffset1UOMValue.js',
                    'PickerItems': {
                        'DisplayValue': '{UoM} - {Description}',
                        'ReturnValue': '{UoM}',
                        'Target': {
                            'EntitySet': 'UsageUoMs',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': "$filter=Dimension eq 'LENGTH'",
                        },
                    },
                },
            },
            {
                'Type': 'ListPicker',
                'Name': 'Offset2Type',
                'IsMandatory': false,
                'IsReadOnly': false,
                'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnValueChange.js',
                'Property': 'LAMObjectDatum_Nav/Offset2Type',
                'Parameters': {
                    'Search': {
                        'Enabled': true,
                        'Delay': 500,
                        'MinimumCharacterThreshold': 3,
                        'Placeholder': clientAPI.localizeText('search'),
                        'BarcodeScanner': true,
                    },
                    'ItemsPerPage': 20,
                    'CachedItemsToLoad': 2,
                    'Caption': clientAPI.localizeText('offset2_type'),
                    'DisplayValue': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTOffset2TypeValue.js',
                    'Value': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTOffset2TypeValue.js',
                    'PickerItems': {
                        'DisplayValue': '{OffsetTypeCode} - {Description}',
                        'ReturnValue': '{OffsetTypeCode}',
                        'Target': {
                            'EntitySet': 'LAMOffsetTypes',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': '',
                        },
                    },
                },
            },
            '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTOffset2Control.js',
            {
                'Type': 'ListPicker',
                'Name': 'Offset2UOM',
                'IsMandatory': false,
                'IsReadOnly': false,
                'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnValueChange.js',
                'Property': 'LAMObjectDatum_Nav/Offset2UOM',
                'Parameters': {
                    'Search': {
                        'Enabled': true,
                        'Delay': 500,
                        'MinimumCharacterThreshold': 3,
                        'Placeholder': clientAPI.localizeText('search'),
                        'BarcodeScanner': true,
                    },
                    'ItemsPerPage': 20,
                    'CachedItemsToLoad': 2,
                    'Caption': clientAPI.localizeText('offset2_uom'),
                    'DisplayValue': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTOffset2UOMValue.js',
                    'Value': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/Values/LAM/MeasuringPointsEDTOffset2UOMValue.js',
                    'PickerItems': {
                        'DisplayValue': '{UoM} - {Description}',
                        'ReturnValue': '{UoM}',
                        'Target': {
                            'EntitySet': 'UsageUoMs',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': "$filter=Dimension eq 'LENGTH'",
                        },
                    },
                },
            },
        ];
    }

    return [];
}

export function GetDiscardSection() {
    return {
        '_Type': 'Section.Type.FormCell',
        '_Name': 'DiscardSection',
        'Controls': [{
            '_Type': 'Control.Type.FormCell.Button',
            '_Name': 'DiscardButton',
            'Title': '$(L,discard)',
            'OnPress': '/SAPAssetManager/Rules/Common/DiscardAction.js',
            'ButtonType': 'Text',
            'Semantic': 'Tint',
            'TextAlignment': '/SAPAssetManager/Rules/Common/Platform/ModalButtonAlign.js',
        }],
    };
}
