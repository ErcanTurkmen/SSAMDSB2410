import CommonLibrary from '../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../LCNC/ModifyListViewSearchCriteria';
import Logger from '../Log/Logger';
import documentFilter from './DocumentFilter';

export default function DocumentsBDSQueryOption(context, top) {
    const searchString = context.searchString;

    const queryOpts = {
        'expand': 'Document',
        'orderby': 'Document/FileName',
        'filter': documentFilter(context),
    };

    if (top) {
        queryOpts.top = top;
    }

    if (searchString) {
        const qob = context.dataQueryBuilder();
        qob.expand(queryOpts.expand).orderBy(queryOpts.orderby);

        qob.filter(`${queryOpts.filter} and ${getSearchQuery(context, searchString)}`);
        if (queryOpts.top) {
            qob.top(queryOpts.top);
        }
        return qob;
    } else {
        const params = Object.entries(queryOpts)
            .map(([key, value]) => `$${key}=${value}`)
            .join('&');
        Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'QueryOption: ' + params);
        return params;
    }

}

function getSearchQuery(context, searchString) {
    const searchByProperties = ['Document/FileName', 'Document/Description', 'Document/FileSize'];
    ModifyListViewSearchCriteria(context, 'Document', searchByProperties);

    return CommonLibrary.combineSearchQuery(searchString, searchByProperties);
}
