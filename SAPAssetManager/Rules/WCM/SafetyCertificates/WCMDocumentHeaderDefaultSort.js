import FilterSettings from '../../Filter/FilterSettings';

export default function WCMDocumentHeaderDefaultSort(context) {
    const defaultSort = [context.createFilterCriteria(context.filterTypeEnum.Sorter, 'Priority', 'SortFilter', ['Priority'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('priority')])];
    const LOTOCertificatesListPageProxy = context.evaluateTargetPathForAPI('#Page:LOTOCertificatesListViewPage');
    FilterSettings.saveInitialFilterForPage(LOTOCertificatesListPageProxy, defaultSort);
    return defaultSort;
}
