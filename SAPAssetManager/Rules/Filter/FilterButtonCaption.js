import FilterLibrary from './FilterLibrary';
import libCommon from '../Common/Library/CommonLibrary';

/** @param {IPageProxy} context  */
export default function FilterButtonCaption(context) {
    const sectionedTable = context.getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    if (sectionedTable && sectionedTable.filters) {
        const filterCount = FilterLibrary.getFilterCountFromCriterias(sectionedTable.filters);
        return FilterLibrary.getFilterButtonText(context, filterCount);
    } else {
        const count = libCommon.getStateVariable(context, 'filterCount', libCommon.getPageName(context)) || 0;
        if (count > 0 && !FilterLibrary.isDefaultFilter(context)) {
            return context.localizeText('filter_count', [count]);
        } else {
            return context.localizeText('filter');
        }
    }
}
