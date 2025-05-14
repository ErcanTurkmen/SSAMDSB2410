import getCaptionState from '../Common/GetCaptionStateForListPage';

export default function ProductionOrderComponentsListOnReturning(context) {

    const sectionedTableProxy = context.getControl('SectionedTable');

    // Workaround suggested in MDKBUG-1391
    // Setting the filters will redraw the FilterFeedbackBar.
    // Triggering section redraw with true param would force full redraw instead of row redraw.
    const currentFilters = sectionedTableProxy.filters;
    sectionedTableProxy.filters = currentFilters;

    const section = sectionedTableProxy.getSection('PRDComponentsSectionObjectTable');
    if (section) {
        section.redraw(true);
    }

    sectionedTableProxy.redraw().then(()=>{
        getCaptionState(context, 'ProductionOrderComponentsListPage');
    });
}
