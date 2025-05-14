import IsPMWorkOrderEnabled from '../UserFeatures/IsPMWorkOrderEnabled';
import IsCSServiceOrderEnabled from '../UserFeatures/IsCSServiceOrderEnabled';
import IsPMNotificationEnabled from '../UserFeatures/IsPMNotificationEnabled';
import IsCSNotificationEnabled from '../UserFeatures/IsCSNotificationEnabled';


export default function OnlineSearchTabItems(context) {
    const items = [];

    if (IsPMWorkOrderEnabled(context) || IsCSServiceOrderEnabled(context)) {
        items.push({
            '_Name': '/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global',
            'Caption': '$(L, workorders)',
            '_Type': 'Control.Type.TabItem',
            'PageToOpen': '/SAPAssetManager/Pages/OnlineSearch/WorkOrdersListView.page',
            'OnPress': '/SAPAssetManager/Rules/OnlineSearch/RedrawActionbarToolbar.js',
        });
    }

    if (IsPMNotificationEnabled(context) || IsCSNotificationEnabled(context)) {
        items.push({
            '_Name': '/SAPAssetManager/Globals/OnlineSearch/NotificationsTab.global',
            'Caption': '$(L, notifications)',
            '_Type': 'Control.Type.TabItem',
            'PageToOpen': '/SAPAssetManager/Pages/OnlineSearch/NotificationsListView.page',
            'OnPress': '/SAPAssetManager/Rules/OnlineSearch/RedrawActionbarToolbar.js',
        });
    }

    return items.concat([
        {
            '_Name': '/SAPAssetManager/Globals/OnlineSearch/EquipmentTab.global',
            'Caption': '$(L, equipments)',
            '_Type': 'Control.Type.TabItem',
            'PageToOpen': '/SAPAssetManager/Pages/OnlineSearch/EquipmentListView.page',
            'OnPress': '/SAPAssetManager/Rules/OnlineSearch/RedrawActionbarToolbar.js',
        },
        {
            '_Name': '/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global',
            'Caption': '$(L, functional_location)',
            '_Type': 'Control.Type.TabItem',
            'PageToOpen': '/SAPAssetManager/Pages/OnlineSearch/FuncLocListView.page',
            'OnPress': '/SAPAssetManager/Rules/OnlineSearch/RedrawActionbarToolbar.js',
        },
    ]);
}
