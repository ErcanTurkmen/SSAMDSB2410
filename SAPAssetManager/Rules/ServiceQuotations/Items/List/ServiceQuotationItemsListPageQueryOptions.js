import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';
import Logger from '../../../Log/Logger';

export default function ServiceQuotationItemsListPageQueryOptions(context) {
    const listQuery = context.dataQueryBuilder();
    const captionQuery = context.dataQueryBuilder();

    listQuery.expand('MobileStatus_Nav,Document/Document,S4ServiceErrorMessage_Nav,S4ServiceQuotation_Nav/Customer_Nav');

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

    if (context.binding?.['@odata.type'] === '#sap_mobile.S4ServiceQuotation') {
        listQuery.filter(`(ObjectID eq '${context.binding.ObjectID}')`);
        captionQuery.filter(`(ObjectID eq '${context.binding.ObjectID}')`);
    }

    updateCaption(context, captionQuery);

    return listQuery;
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['ItemDesc', 'DueBy', 'ObjectID', 'ItemNo'];
        ModifyListViewSearchCriteria(context, 'S4ServiceQuotationItem', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}

async function updateCaption(context, captionQuery) {
    try {
        const pageProxy = context.getPageProxy ? context.getPageProxy() : context;
        const countQuery = await captionQuery.build();

        let totalQuery = '';
        if (context.binding?.['@odata.type'] === '#sap_mobile.S4ServiceQuotation') {
            totalQuery = `$filter=ObjectID eq '${context.binding.ObjectID}'`;
        }

        const totalCount = await context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceQuotationItems', totalQuery);
        const count = await context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceQuotationItems', countQuery);

        let caption;
        if (count === totalCount) {
            caption = context.localizeText('service_quotation_items_x', [totalCount]);
        } else {
            caption = context.localizeText('service_quotation_items_x_x', [count, totalCount]);
        }

        pageProxy.setCaption(caption);
    } catch (error) {
        Logger.error('ServiceQuotationItemsListPageQueryOptions', error);
    }
}
