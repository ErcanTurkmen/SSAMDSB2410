import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export default function WorkOrderHistoryListViewQueryOptions(context) {
    const { searchString } = context;

    let referenceType = libCom.getTargetPathValue(context, '#Page:-Previous/#ClientData/#Property:ReferenceType');

    const qob = context.dataQueryBuilder();
    qob.expand('HistoryLongText', 'HistoryPriority');
    qob.orderBy('Priority', 'OrderId desc');

    if (!libVal.evalIsEmpty(referenceType)) {
        if (referenceType === 'P') {
            qob.filter("ReferenceType eq 'P'");
        } else {
            qob.filter("ReferenceType eq 'H'");
        }
    }

    if (searchString) {
        const search = getSearchQuery(context, searchString);
        if (qob.hasFilter) {
            qob.filter().and(search);
        } else {
            qob.filter(search);
        }
    }

    return qob;
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['OrderDescription', 'OrderId'];
        ModifyListViewSearchCriteria(context, 'WorkOrderHistory', searchByProperties);

        searchQuery = libCom.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
