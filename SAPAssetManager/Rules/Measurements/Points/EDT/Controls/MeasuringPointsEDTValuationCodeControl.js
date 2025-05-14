import EDTHelper from '../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTValuationCodeControl(context) {
    let binding = context.binding;

    let latestDoc = EDTHelper.getLatestMeasurementDoc(context, binding);
    let selectedValue = '';
    let displayValue = '';
    if (latestDoc.ValuationCode) {
        displayValue = latestDoc.ValuationCode;
        selectedValue = 'PMCatalogCodes(Catalog=\'' + binding.CatalogType + '\',CodeGroup=\'' + binding.CodeGroup + '\',Code=\'' + latestDoc.ValuationCode + '\')';
    }
              
    let queryOptions = `$filter=CodeGroup eq '${binding.CodeGroup}' and Catalog eq '${binding.CatalogType}'&$orderby=Code`;
    let isReadOnly = !binding.CodeGroup;

    let isMandatory = false;
    if (binding.CodeGroup) {
        if (binding.CharName) {
            if (binding.IsCodeSufficient === 'X' && !latestDoc.ReadingValue) {
                isMandatory = true;
            }
        } else {
            isMandatory = true;
        }
    }

    return {
        'Type': 'ListPicker',
        'Name': 'ValuationCode',
        'IsMandatory': isMandatory,
        'IsReadOnly': isReadOnly,
        'Property': 'ValuationCode',
        'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/MeasuringPointsEDTValuationCodeControlOnValueChange.js',
        'Parameters': {
            'Search': {
                'Enabled': true,
                'Delay': 500,
                'MinimumCharacterThreshold': 3,
                'Placeholder': context.localizeText('search'),
                'BarcodeScanner': true,
            },
            'ItemsPerPage': 20,
            'CachedItemsToLoad': 2,
            'Caption': context.localizeText('valuation_code'),
            'DisplayValue': displayValue,
            'Value': selectedValue,
            'PickerItems': {
                'DisplayValue': '/SAPAssetManager/Rules/Measurements/DisplayValueValuationCode.js',
                'ReturnValue': '{@odata.readLink}',
                'Target': {
                    'EntitySet': 'PMCatalogCodes',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'QueryOptions': queryOptions,
                },
            },
        },
    };
}
