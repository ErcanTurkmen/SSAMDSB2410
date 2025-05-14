import PhysicalInventoryItemsNotCountedCaption from '../../Inventory/PhysicalInventory/PhysicalInventoryItemsNotCountedCaption';
import { PI_NOT_COUNTED_FILTER, PI_COUNTED_FILTER } from '../../Inventory/PhysicalInventory/PhysicalInventoryCountNavWrapper';
import PhysicalInventoryItemsCountedCaption from './PhysicalInventoryItemsCountedCaption';
import libCom from '../../Common/Library/CommonLibrary';
/**
* This function sets the default filter
* @param {IClientAPI} context
*/
export default function GetPreselectedFilter(context) {
  let PINotCountedFilter = context.createFilterCriteria(context.filterTypeEnum.Filter, 'PINotCounted', [PhysicalInventoryItemsNotCountedCaption(context)], [ PI_NOT_COUNTED_FILTER ], true);
  let PICountedFilter = context.createFilterCriteria(context.filterTypeEnum.Filter, 'PICounted', [PhysicalInventoryItemsCountedCaption(context)], [ PI_COUNTED_FILTER ], true);

  //Default select not counted filter
  let filters = [ PINotCountedFilter ];
  //Select counted filter as well if navigating after count all
  if (libCom.getStateVariable(context, 'BulkUpdateItem') > 0) {
    filters.push(PICountedFilter);
    libCom.removeStateVariable(context, 'BulkUpdateItem');
  }

  return filters;
}

