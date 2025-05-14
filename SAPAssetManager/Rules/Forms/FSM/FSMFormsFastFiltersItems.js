import SmartFormFastFilters from '../../FastFilters/FSMFastFilters/SmartFormFastFilters';

export default function FSMFormsFastFiltersItems(context) {
    let SmartFormFastFiltersClass = new SmartFormFastFilters(context);
    return SmartFormFastFiltersClass.getFastFilterItemsForListPage(context);
}
