import libSearch from '../OnlineSearchLibrary';

export default async function StatusFilterOptions(control) {
    let filterValue = [];
    const isFilterByStatusCode = isSearchByStatusCode(control);
    const statusOptions = getStatusOptionsByEntityType(control);
    const queryFilter = statusOptions.map(opt => `SystemStatus eq '${opt}'`).join(' or ');

    const systemStatusRecords = await control.read(
        '/SAPAssetManager/Services/AssetManager.service', 
        'SystemStatuses', 
        [], 
        `$filter=${queryFilter}`,
    );
    
    systemStatusRecords.forEach(i => {
        filterValue.push({
            ReturnValue: i.SystemStatus,
            DisplayValue: i.StatusText,
        });
    });

    return {
        name: isFilterByStatusCode ? 'SystemStatusCode' : 'SysStatus',
        values: filterValue,
    };
}

function getStatusOptionsByEntityType(control) {
    const activeTab = libSearch.getCurrentTabName(control);
    const equipmentTabName = control.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/EquipmentTab.global').getValue();
    const funcLocTabName = control.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global').getValue();
    const workOrdersTabName = control.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue();
    const notificationsTabName = control.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/NotificationsTab.global').getValue();

    switch (activeTab) {
        case equipmentTabName:
            return ['I0099', 'I0100', 'I0116', 'I0184'];
        case funcLocTabName:
            return ['I0013', 'I0076', 'I0098', 'I0320'];
        case workOrdersTabName:
            return ['I0001', 'I0009', 'I0002', 'I0010', 'I0045', 'IEAM5', 'I0820', 'I0809'];
        case notificationsTabName:
            return ['I0068', 'I0072', 'I0070', 'I0069', 'I0158', 'I0071', 'I0526', 'I0525'];
        default:
            return [];
    }
}

function isSearchByStatusCode(control) {
    const activeTab = libSearch.getCurrentTabName(control);
    const workOrdersTabName = control.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue();
    const notificationsTabName = control.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/NotificationsTab.global').getValue();
    return activeTab === workOrdersTabName || activeTab === notificationsTabName;
}
