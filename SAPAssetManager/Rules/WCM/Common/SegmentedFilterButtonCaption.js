import CommonLibrary from '../../Common/Library/CommonLibrary';
import FilterLibrary from '../../Filter/FilterLibrary';

/** @param {IPageProxy} context  */
export default function SegmentedFilterButtonCaption(context) {
    const selectedTabName = context.getControls()[0].getSelectedTabItemName();
    if (!selectedTabName) {
        return FilterLibrary.getFilterButtonText(context, 0);
    }
    const sectionedTable = CommonLibrary.getSectionedTableProxy(context);
    const filterCount = FilterLibrary.getFilterCountFromCriterias(sectionedTable && sectionedTable.filters || []);
    return FilterLibrary.getFilterButtonText(context, filterCount);
}
