import AssignedToLibrary from '../../Common/AssignedToLibrary';
import RedrawFilterToolbar from '../../../Filter/RedrawFilterToolbar';

export default function OperationalItemstFilterOnLoaded(context) {
    const filters = context.getPageProxy().getFilter().getFilters();
    if (!filters) {
        return;
    }
    RedrawFilterToolbar(context);

    const partnersNav = context.getPageProxy().binding.PartnersNavPropName;
    AssignedToLibrary.CollectAssignedToSelectedItemsFromFilterCriteria(context, filters, partnersNav);
}
