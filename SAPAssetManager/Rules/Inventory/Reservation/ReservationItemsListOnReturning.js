import getCaptionState from '../Common/GetCaptionStateForListPage';

export default function ReservationItemsListOnReturning(context) {
    
    let sectionedTableProxy = context.getControls()[0];
    // Setting the filters will redraw the FilterFeedbackBar.
    // Triggering section redraw with true param would force full redraw instead of row redraw.
    const currentFilters = sectionedTableProxy.filters;
    sectionedTableProxy.filters = currentFilters;

    const section = sectionedTableProxy.getSection('ReservationItemsSectionObjectTable');
    if (section) {
        section.redraw(true);
    }

    sectionedTableProxy.redraw().then(() => {
        getCaptionState(context, 'ReservationItemsListPage');
    });
}
