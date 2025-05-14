import ListViewToggleMode from '../ListViewToggleMode';

export default function NotificationListOnUnloaded(context) {
    const onlineSearchPage = context.evaluateTargetPathForAPI('#Page:OnlineSearch');
    if (context.getControl('SectionedTable').getSections()[0].getSelectionMode() === 'Multiple') {
        return ListViewToggleMode(onlineSearchPage, context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/NotificationsTab.global').getValue());
    }
}
