/**
* Returns List Picker definition for Unit
* @param {IClientAPI} context
*/
export default function ServiceItemsEDTMaterialUOMsListPicker(context) {
    return {
        'Type': 'ListPicker',
		'Name': 'Unit',
		'IsMandatory': true,
		'Property': 'QuantityUOM',
        'OnValueChange': '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/EDT/ServiceItemsEDTCellOnValueChange.js',
		'Parameters': {
            'Search': {
                'Enabled': true,
                'Delay': 500,
                'MinimumCharacterThreshold': 2,
                'Placeholder': '$(L,search)',
                'BarcodeScanner': false,
            },
            'Caption': '$(L, unit)',
            'Value': '{QuantityUOM}',
            'PickerItems': {
                'DisplayValue': '{UOM}',
                'ReturnValue': '{UOM}',
                'Target': {
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'EntitySet': 'MaterialUOMs',
                    'QueryOptions': `$filter=MaterialNum eq '${context.binding?.ProductID}'`,
                },
            },
		},
    };
}
