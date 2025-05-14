import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import libCom from '../../Common/Library/CommonLibrary';
import { setMeasuringPoitsListCaptionWithCount } from '../OnMeasuringPointsFilterSuccess';

export default function MeasuringPointsListViewQueryOption(context) {
    let queryFromFilter = libCom.getQueryOptionFromFilter(context);

    if (typeof context.dataQueryBuilder === 'function') {
        let qob = context.dataQueryBuilder();
        let searchString = context.searchString;

        let readLink = context.evaluateTargetPathForAPI('#Page:-Previous').getReadLink();
        if (readLink && readLink.indexOf('MyWorkOrderOperations') !== -1) {
            queryFromFilter = queryFromFilter ? `${queryFromFilter} and (PRTCategory eq 'P')` : "$filter=PRTCategory eq 'P'";
            qob.expand('PRTPoint').orderBy('ItemNum').select('PRTPoint/Point,PRTPoint/PointDesc,PRTPoint/UoM,PRTPoint/IsPrevReading,PRTPoint/PrevReadingDate,PRTPoint/PrevReadingTime,PRTPoint/PrevReadBy,PRTPoint/PrevReadingValue,PRTPoint/PrevHasReadingValue,PRTPoint/PrevValuationCode,PRTPoint/PrevCodeDescription');
            if (searchString) {
                qob.filter(`(PRTCategory eq 'P') and (${getSearchQuery(context, searchString, readLink)})`);
            } else {
                qob.filter('(PRTCategory eq \'P\')');
            }
        } else {
            qob.orderBy('SortField').select('Point,PointDesc,UoM,IsPrevReading,PrevReadingDate,PrevReadingTime,PrevReadBy,PrevReadingValue,PrevHasReadingValue,PrevValuationCode,PrevCodeDescription');
            if (searchString) {
                qob.filter(getSearchQuery(context, searchString, readLink));
            }
        }
        qob.build().then(queryoptions => setMeasuringPoitsListCaptionWithCount(context.getPageProxy(), queryFromFilter, queryoptions));
        return qob;
    } else {
        setMeasuringPoitsListCaptionWithCount(context, queryFromFilter, '');
        return '$orderby=SortField&$select=Point,PointDesc,UoM,IsPrevReading,PrevReadingDate,PrevReadingTime,PrevReadBy,PrevReadingValue,PrevHasReadingValue,PrevValuationCode,PrevCodeDescription';
    }
}

function getSearchQuery(context, searchString, readLink = '') {
    let searchQuery = 'true';

    if (searchString) {
        let searchByProperties = ['Point', 'PointDesc'];
        if (readLink.indexOf('MyWorkOrderOperations') !== -1) {
            searchByProperties = ['PRTPoint/PointDesc', 'PRTPoint/Point'];
        }

        ModifyListViewSearchCriteria(context, 'MeasuringPoint', searchByProperties);

        searchQuery = libCom.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
