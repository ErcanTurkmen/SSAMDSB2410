import CommonLibrary from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import Logger from '../../Log/Logger';

export default function ServiceQuotationsListPageQueryOptions(context) {
    const listQuery = context.dataQueryBuilder();
    const captionQuery = context.dataQueryBuilder();

    listQuery.expand('MobileStatus_Nav,Document/Document,S4ServiceErrorMessage_Nav,ServiceItems_Nav,Customer_Nav');

    const searchString = context.searchString;
    if (searchString) {
        //Standard order filters (required when using a dataQueryBuilder)
        const search = getSearchQuery(context, searchString);
        listQuery.filter(`(${search})`);
    }

    const quickFilters = CommonLibrary.GetSectionedTableFilterTerm(context);
    if (quickFilters) {
        captionQuery.filter(quickFilters);
    }

    updateCaption(context, captionQuery);

    return listQuery;
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Description', 'DueBy', 'ObjectID', 'Customer_Nav/OrgName1'];
        ModifyListViewSearchCriteria(context, 'S4ServiceQuotation', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}

async function updateCaption(context, captionQuery) {
    try {
        const pageProxy = context.getPageProxy ? context.getPageProxy() : context;
        const countQuery = await captionQuery.build();

        const totalCount = await context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceQuotations', '');
        const count = await context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceQuotations', countQuery);

        let caption;
        if (count === totalCount) {
            caption = context.localizeText('service_quotations_x', [totalCount]);
        } else {
            caption = context.localizeText('service_quotations_x_x', [count, totalCount]);
        }

        pageProxy.setCaption(caption);
    } catch (error) {
        Logger.error('ServiceQuotationsListPageQueryOptions', error);
    }
}
