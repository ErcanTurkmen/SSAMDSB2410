import libSearch from '../OnlineSearchLibrary';

export default function SortByItems(context) {
    const activeTab = libSearch.getCurrentTabName(context);
    const equipmentTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/EquipmentTab.global').getValue();
    const funcLocTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global').getValue();
    const workOrdersTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue();
    const notificationsTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/NotificationsTab.global').getValue();

    const commonEquipmentAndFuncLocItems = [
        {
            ReturnValue: 'PlanningPlant',
            DisplayValue: '$(L,plant)',
        },
        {
            ReturnValue: 'SysStatus',
            DisplayValue: '$(L,status)',
        },
    ];

    const commonWorkOrdersAndNotifications = [
        {
            ReturnValue: 'Priority',
            DisplayValue: '$(L,priority)',
        },
        {
            ReturnValue: 'SystemStatus',
            DisplayValue: '$(L,status)',
        },
    ];

    switch (activeTab) {
        case equipmentTabName:
            return [
                {
                    ReturnValue: 'EquipId',
                    DisplayValue: '$(L,ID)',
                },
                {
                    ReturnValue: 'EquipDesc',
                    DisplayValue: '$(L,description)',
                },
                {
                    ReturnValue: 'MaintWorkCenter',
                    DisplayValue: '$(L,workcenter)',
                },
                ...commonEquipmentAndFuncLocItems,
            ];
        case funcLocTabName:
            return [
                {
                    ReturnValue: 'FuncLocId',
                    DisplayValue: '$(L,ID)',
                },
                {
                    ReturnValue: 'FuncLocDesc',
                    DisplayValue: '$(L,description)',
                },
                {
                    ReturnValue: 'WorkCenter',
                    DisplayValue: '$(L,workcenter)',
                },
                ...commonEquipmentAndFuncLocItems,
            ];
        case workOrdersTabName:
            return [
                {
                    ReturnValue: 'DueDate',
                    DisplayValue: '$(L,due_date)',
                },
                {
                    ReturnValue: 'OrderId',
                    DisplayValue: '$(L,ID)',
                },
                ...commonWorkOrdersAndNotifications,
            ];
        case notificationsTabName:
            return [
                {
                    ReturnValue: 'CreationDate',
                    DisplayValue: '$(L,created_date)',
                },
                {
                    ReturnValue: 'RequiredEndDate',
                    DisplayValue: '$(L,due_date)',
                },
                {
                    ReturnValue: 'NotificationNumber',
                    DisplayValue: '$(L,ID)',
                },
                ...commonWorkOrdersAndNotifications,
            ];
        default:
            return [];
    }
}
