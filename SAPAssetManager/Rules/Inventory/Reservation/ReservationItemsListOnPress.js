export default function ReservationItemsListOnPress(context) {
    context.evaluateTargetPathForAPI('#Page:ReservationItemsListPage').getControl('SectionedTable').redraw();
}
