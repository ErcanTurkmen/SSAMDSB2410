export default function WorkOrderOperationsSelectModeButtonVisible(context) {
    if (context.getPageProxy().getControl('SectionedTable')) {
        if (context.getPageProxy().getControl('SectionedTable').getSections()[0].getSelectionMode() === 'Multiple') {
            return true;
        }
    }
    return false;
}
