export default function GetItemsFastFilters(context) {

    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'PurchaseOrderHeader' || type === 'StockTransportOrderHeader') {
        return [
            { 
                '_Name': 'OpenGenericItems',
                '_Type': 'Control.Type.FastFilterItem',
                'FilterType': 'Filter',
                'FilterProperty': '',
                'CustomQueryGroup': 'OpenGenericItems',
                'DisplayValue': '/SAPAssetManager/Rules/Inventory/PurchaseOrder/GIFilterCaptionOpen.js',
                'ReturnValue': '1 gt -1',
            },
            { 
                '_Name': 'ConsumedGenericItems',
                '_Type': 'Control.Type.FastFilterItem',
                'FilterType': 'Filter',
                'FilterProperty': '',
                'CustomQueryGroup': 'ClosedGenericItems',
                'DisplayValue': '/SAPAssetManager/Rules/Inventory/PurchaseOrder/GIFilterCaptionConsumed.js',
                'ReturnValue': '2 gt -2',
            },
        ];
    } 
    return [];
}

