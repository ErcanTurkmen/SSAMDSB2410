import { DQBExpand, DQBFilter } from './DataQueryBuilderUtils';
import libCom from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export function ListPageGetCombinedQueryOptions(context, toExpand, navigationRelatedFilterTerms, extraFilters) {
    const toReturnDqb = context.dataQueryBuilder();
    DQBExpand(toReturnDqb, toExpand);
    DQBFilter(toReturnDqb, navigationRelatedFilterTerms);

    DQBFilter(toReturnDqb, extraFilters);
    return toReturnDqb;
}

export function ListPageGetCaptionCountTotalCount(context, toExpand, sectionedTableFilterTerm, navigationRelatedFilterTerms, extraFilters, readLink, captionExtraFilters = []) {
    const [totalCountDqb, countDqb] = [...Array(2)].map(() => context.dataQueryBuilder());

    [totalCountDqb, countDqb]
        .map(dqb => DQBExpand(dqb, toExpand))
        .forEach(dqb => DQBFilter(dqb, navigationRelatedFilterTerms));

    DQBFilter(countDqb, [sectionedTableFilterTerm].concat(extraFilters));

    if (captionExtraFilters && captionExtraFilters.length) {
        DQBFilter(countDqb, captionExtraFilters);
        DQBFilter(totalCountDqb, captionExtraFilters);
    }
    return Promise.all([totalCountDqb, countDqb].map(dqb => dqb.build()))
        .then(([totalCountDqbTerms, countDqbTerms]) => Promise.all([
            libCom.getEntitySetCount(context, readLink, countDqbTerms),
            libCom.getEntitySetCount(context, readLink, totalCountDqbTerms),
        ]));
}

export function GetSearchStringFilterTerm(context, searchString, properties, entityTypeName) {
    if (searchString) {
        ModifyListViewSearchCriteria(context, entityTypeName, properties);
        const dqb = context.dataQueryBuilder();
        const filterBuilder = dqb.filterTerm().or(...properties.map(propName => `substringof('${searchString.toLowerCase()}', tolower(${propName}))`));
        return filterBuilder.composeFilterString(filterBuilder);
    }
    return '';
}
