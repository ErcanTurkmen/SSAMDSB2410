import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import ParentItemPickerQueryOptions from '../../../ServiceItems/CreateUpdate/ParentItemPickerQueryOptions';

/**
* Returns field definition for Parent Item
* @param {IClientAPI} context
*/
export default function ServiceItemsEDTParentItemField(context) {
    // Formatting standard item No value into integer - 10, 20 etc.
    const parsedParentItem = parseInt(context.binding?.HigherLvlItem);

    if (libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
        const formattedItemNo = parsedParentItem === 0 ? '' : context.binding?.HigherLvlItem?.slice(-6) || '';
        return {
            'Type': 'ListPicker',
            'Name': 'HigherLvlItem',
            'IsMandatory': false,
            'Property': 'HigherLvlItem',
            'OnValueChange': '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/EDT/ServiceItemsEDTCellOnValueChange.js',
            'Parameters': {
                'Search': {
                    'Enabled': true,
                    'Delay': 500,
                    'MinimumCharacterThreshold': 3,
                    'Placeholder': '$(L, search)',
                },
                'Caption': '$(L, parent_item)',
                'Value': formattedItemNo,
                'DisplayValue': formattedItemNo,
                'PickerItems': {
                    'DisplayValue': '{ItemDesc} - {ItemNo}',
                    'ReturnValue': '{ItemNo}',
                    'Target': {
                        'EntitySet': 'S4ServiceItems',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': ParentItemPickerQueryOptions(context),
                    },
                },
            },
        };
    } else {
        return {
            'Type': 'Number',
            'IsMandatory': false,
            'IsReadOnly': true,
            'Property': 'HigherLvlItem',
            'Name': 'HigherLvlItem',
            'Parameters': {
                ...(
                    libVal.evalIsNumeric(parsedParentItem) && parsedParentItem !== 0 ?
                        { 'Value': parsedParentItem } :
                        {}
                ),
            },
        };
    }
}
