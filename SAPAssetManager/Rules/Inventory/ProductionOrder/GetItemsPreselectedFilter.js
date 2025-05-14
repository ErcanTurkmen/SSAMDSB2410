import ProductionOrderOpenItemsDisplayValue from './ProductionOrderOpenItemsDisplayValue';

export default function GetItemsPreselectedFilter(context) {
    let filterQuery = "DeliveryCompletedFlag ne 'X' and (OrderQuantity eq 0 or ReceivedQuantity eq 0 or OrderQuantity gt ReceivedQuantity)"; 
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'OpenItems', [ProductionOrderOpenItemsDisplayValue(context)], [filterQuery], true)];
}
