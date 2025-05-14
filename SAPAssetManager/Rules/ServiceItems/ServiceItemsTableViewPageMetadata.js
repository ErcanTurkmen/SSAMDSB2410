import EDTSoftInputModeConfig from '../Extensions/EDT/EDTSoftInputModeConfig';

export default function ServiceItemsTableViewPageMetadata(context) {
    EDTSoftInputModeConfig(context);

    const page = context.getPageDefinition('/SAPAssetManager/Pages/ServiceOrders/ServiceItemsTableView.page');
    const sectionTable = page.Controls[0];
    const edtSection = sectionTable.Sections[0];
    
    // reset back target as it cached by EDT extension
    edtSection.ExtensionProperties.Target = {
        'EntitySet':  '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/EDT/ServiceItemTableEntitySet.js',
        'Service': '/SAPAssetManager/Services/AssetManager.service',
        'QueryOptions': '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/EDT/ServiceItemTableQueryOptions.js',
    };

    return page;
}
