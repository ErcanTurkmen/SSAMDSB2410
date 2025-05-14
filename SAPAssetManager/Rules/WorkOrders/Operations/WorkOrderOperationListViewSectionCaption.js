export default function WorkOrderOperationListViewSectionCaption(context) {
    if (context.getPageProxy().getControl('SectionedTable') && context.getPageProxy().getControl('SectionedTable').getSections()[0].getSelectionMode() === 'Multiple') {
        return context.localizeText('operations_available_for_quick_confirmation');
    } else {
        return '';
    }
}
