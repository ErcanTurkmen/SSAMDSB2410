import ProductionOrderOpenComponentsDisplayValue from './ProductionOrderOpenComponentsDisplayValue';
import ProductionOrderOpenComponentsFilterQuery from './ProductionOrderOpenComponentsFilterQuery';
/**
* This function sets default filter for PRD components
* @param {IClientAPI} context
*/
export default function GetComponentsPreselectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'OpenComponents', [ProductionOrderOpenComponentsDisplayValue(context)],[ProductionOrderOpenComponentsFilterQuery()], true)];
}
