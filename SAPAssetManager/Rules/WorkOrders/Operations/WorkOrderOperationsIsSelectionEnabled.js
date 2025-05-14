export default function WorkOrderOperationsIsSelectionEnabled(context) {
    if (context.getPageProxy().getControl('SectionedTable')) {
        return context.getPageProxy().getControl('SectionedTable').getSections()[0].getSelectionMode() !== 'Multiple';
    }
    // returning true on initial load as far as table doesn't exists
    return true;
}
