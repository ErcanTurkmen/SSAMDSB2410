import Logger from '../../Log/Logger';
import RedrawDetailsHeader from '../Common/RedrawDetailsHeader';

export default function StockTransportOrderDetailsPageOnReturn(context) {
    try {
        if (context.evaluateTargetPathForAPI('#Page:POMaterialDocItemsListPage')) {
            context.evaluateTargetPathForAPI('#Page:POMaterialDocItemsListPage').getControl('SectionedTable').getSection('SectionObjectTable').redraw(true);
        }
    } catch (err) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/Inventory/CategoryStockTransportOrder.global').getValue(), 'StockTransportOrderDetailsPageOnReturn(context)' + err);
    }

    // Setting the filters will redraw the FilterFeedbackBar.
    // Triggering section redraw with true param would force full redraw instead of row redraw.
    let sectionedTableProxy = context.getControls()[0];
    const currentFilters = sectionedTableProxy.filters;
    sectionedTableProxy.filters = currentFilters;

    const section = sectionedTableProxy.getSection('SectionObjectTable');
    if (section) {
        section.redraw(true);
    }

    sectionedTableProxy.redraw().then(() => {
        return RedrawDetailsHeader(context);
    });
}
