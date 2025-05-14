import RedrawDetailsHeader from '../Common/RedrawDetailsHeader';

export default function OutboundDeliveryDetailsPageOnReturn(context) {

    const sectionedTableProxy = context.getControls()[0];

    // Setting the filters will redraw the FilterFeedbackBar.
    // Triggering section redraw with true param would force full redraw instead of row redraw.
    const currentFilters = sectionedTableProxy.filters;
    sectionedTableProxy.filters = currentFilters;

    const section = sectionedTableProxy.getSection('SectionObjectTable');
    if (section) {
        section.redraw(true);
    }

    return RedrawDetailsHeader(context);
}
