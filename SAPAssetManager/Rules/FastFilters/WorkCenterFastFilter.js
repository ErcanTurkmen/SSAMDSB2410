import CommonLibrary from '../Common/Library/CommonLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';


export function setWorkCenterFilterValues(context, wcPickerProxy, wcPropertyName) {
    const myworkcenterExtIds = CommonLibrary.getParsedUserWorkCenters();
    if (myworkcenterExtIds.length === 0 || myworkcenterExtIds.length === 1) {  // with single my-wc mdk can match the filterterms, this is noop
        return;
    }
    const filters = context.getPageProxy().getFilter().getFilters();
    const wcIds = getWorkCenterIdsFromFilterCriteria(context, filters, wcPropertyName);
    wcPickerProxy.setValue(wcIds);
}

/** @param {Array<FilterCriteria>} criteria */
function getWorkCenterIdsFromFilterCriteria(context, criteria, wcPropertyName) {
    const wcFilterTerms = [];
    criteria.forEach(({ type, filterItems }) => {
        if (type === context.filterTypeEnum.Filter && !!filterItems.length && filterItems.some(i => i.includes(`${wcPropertyName} eq`))) {
            wcFilterTerms.push(...filterItems.map(term => term.split(' or ')));
        }
    });
    const flattenedwcFilterTerms = [].concat.apply([], wcFilterTerms);  // hack: chakra js missing flatten
    const pattern = new RegExp(`${wcPropertyName}\\b\\ eq\\b\\ '([a-zA-Z0-9]+)'`);
    return flattenedwcFilterTerms.map(item => item.match(pattern)[1]);
}

export async function createNewWorkCenterFilterCriteria(context, workcenterFilterCriteria, workcenterFilterProperty) {
    const myWcIds = await GetMyWorkCenterFastFilterIds(context);
    if (myWcIds.length === 0 || myWcIds.length === 1) {  // with single my-wc mdk can match the filterterms
        return workcenterFilterCriteria;
    }
    let filterRV = [], filterDV = [];
    const myWorkCenterTerm = GetMyWorkCenterFastFilterQueryFromIds(myWcIds, workcenterFilterProperty);
    if (!!myWcIds.length && myWcIds.every(workCenter => workcenterFilterCriteria.filterItems.includes(workCenter))) {
        [filterRV, filterDV] = workcenterFilterCriteria.filterItems.reduce(([rv, dv], curr, i) => {
            if (!myWcIds.includes(curr)) {
                rv.push(`${workcenterFilterProperty} eq '${curr}'`);
                dv.push(workcenterFilterCriteria.filterItemsDisplayValue[i]);
            }
            return [rv, dv];
        }, [[], []]);
        filterRV.push(myWorkCenterTerm);
        filterDV.push(GetMyWorkCenterFastFilterDV(context));
    } else {
        dropSelectedMyWc(context, myWorkCenterTerm);
        filterRV = workcenterFilterCriteria.filterItems.map(i => `${workcenterFilterProperty} eq '${i}'`);
        filterDV = workcenterFilterCriteria.filterItemsDisplayValue;
    }
    return context.createFilterCriteria(context.filterTypeEnum.Filter, workcenterFilterProperty, undefined, filterRV, true, '', filterDV);
}

function dropSelectedMyWc(context, myWorkCenterTerm) {
    const prevFilterCriteria = context.getFilter().getFilters();
    const myWcCriteria = prevFilterCriteria?.find(c => c.filterItems.some(term => term === myWorkCenterTerm));
    if (!myWorkCenterTerm || !myWcCriteria) {
        return;
    }
    if (myWcCriteria.filterItems.length === 1) {  // hack: drop my_work_center from prev criteria, mdk cant match it with current filters
        prevFilterCriteria.splice(prevFilterCriteria.findIndex(c => c.filterItems.some(term => term === myWorkCenterTerm)), 1);
    } else {  // in case of additional selected wcs, drop only my_work_center filterterm from criteria
        const myWcTermIndex = myWcCriteria.filterItems.findIndex(t => t === myWorkCenterTerm);
        [myWcCriteria.filterItems, myWcCriteria.filterItemsDisplayValue].forEach(i => i.splice(myWcTermIndex, 1));
    }
}

export async function getWorkCenterFastFilterItem(context, filterProperty) {
    const workcenters = await GetMyWorkCenterFastFilterIds(context);
    if (workcenters.length === 0) {
        return undefined;
    }
    const wcDisplayValue = GetMyWorkCenterFastFilterDV(context);
    const wcReturnValue = GetMyWorkCenterFastFilterQueryFromIds(workcenters, filterProperty);
    if (workcenters.length === 1) {  // with single my-wc mdk can match the filterterms if we let it
        return WorkCenterFastFilterItem(wcDisplayValue, wcReturnValue, '', filterProperty);
    }
    return WorkCenterFastFilterItem(wcDisplayValue, wcReturnValue, filterProperty, '');
}

function GetMyWorkCenterFastFilterIds(context) {
    const workCenters = CommonLibrary.getParsedUserWorkCenters();
    if (ValidationLibrary.evalIsEmpty(workCenters)) {
        return Promise.resolve([]);
    }
    const wcQuery = '$filter=' + workCenters.map(workCenter => `ExternalWorkCenterId eq '${workCenter}'`).join(' or ') + '&$orderby=WorkCenterId';
    return workCenters ? context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', ['WorkCenterId'], wcQuery)
        .then(workCenterResults => Array.from(workCenterResults || [], (/** @type {WorkCenter} */ wc) => wc.WorkCenterId)) : Promise.resolve([]);
}

function GetMyWorkCenterFastFilterQueryFromIds(ids, filterProperty) {
    return ids.length === 1 ? ids[0] : ids.map(wc => `${filterProperty} eq '${wc}'`).join(' or ');
}

function GetMyWorkCenterFastFilterDV(context) {
    const extIds = CommonLibrary.getParsedUserWorkCenters();
    return extIds.length === 1 ? extIds[0] : context.localizeText('my_work_center_filter');
}

/** @returns {import('../FastFilters/FastFilters').FilterFeedbackItem[]} */
function WorkCenterFastFilterItem(dv, rv, customQueryGroup, filterProperty) {
    return {
        _Name: 'WorkCenterFilter',
        _Type: 'Control.Type.FastFilterItem',
        FilterType: 'Filter',
        FilterProperty: filterProperty,
        DisplayValue: dv,
        ReturnValue: rv,
        CustomQueryGroup: customQueryGroup,
        Label: '',
    };
}
