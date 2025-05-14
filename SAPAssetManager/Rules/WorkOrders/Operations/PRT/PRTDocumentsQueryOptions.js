import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';
import Logger from '../../../Log/Logger';

export default function PRTDocumentsQueryOption(context) {
    let searchString = context.searchString;

    let queryOpts = {
        'expand' : 'PRTDocument',
        'filter' : 'PRTCategory eq \'D\'',
    };

    if (searchString) {
        let qob = context.dataQueryBuilder();
        qob.expand(queryOpts.expand).orderBy(queryOpts.orderby);
        qob.filter(`${queryOpts.filter} and ${getSearchQuery(context, searchString.toLowerCase())}`);
        return qob;
    } else {
        let params = [];
        for (let key in queryOpts) {
            params.push(`$${key}=${queryOpts[key]}`);
        }
        Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'QueryOption: ' + params.join('&'));
        return params.join('&');
    }
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['PRTDocument/FileName', 'PRTDocument/Description', 'PRTDocument/FileSize'];
        ModifyListViewSearchCriteria(context, 'MyWorkOrderTool', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
