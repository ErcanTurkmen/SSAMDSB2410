import CommonLibrary from '../Common/Library/CommonLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';

/**
 * @param {IClientAPI} context
 * @returns {Promise<Array<{ReturnValue: string, DisplayValue: string}>>} */
export default function PriorityFilter(context) {
    const pageName = CommonLibrary.getPreviousPageName(context);
    const getReturnValueStrategy = ['ServiceOrdersListViewPage', 'ServiceRequestsListViewPage'].includes(pageName) ? getReturnValue : getReturnValueWithType;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Priorities', [], '$orderby=PriorityDescription')
        .then((/** @type {ObservableArray<Priority>} */ priorities) => {
            if (ValidationLibrary.evalIsEmpty(priorities)) {
                return [];
            }
            const displayValue2returnValues = {};
            const proxy2values = CommonLibrary.defaultObject(displayValue2returnValues, () => []);
            priorities.forEach(p => proxy2values[p.PriorityDescription].push(getReturnValueStrategy(p)));
            return Object.entries(displayValue2returnValues)
                .map(([displayVal, returnVals]) => ({ DisplayValue: displayVal, ReturnValue: returnVals.join(' or ') }));
        })
        .catch(() => []);
}

function getReturnValueWithType(/** @type {Priority} */ priority) {
    return `(Priority eq '${priority.Priority}' and PriorityType eq '${priority.PriorityType}')`;
}
function getReturnValue(/** @type {Priority} */ priority) {
    return `(Priority eq '${priority.Priority}')`;
}
