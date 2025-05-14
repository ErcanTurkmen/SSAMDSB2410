import GetInboundDeliveryOpenCaption from './GetInboundDeliveryOpenCaption';
import GetInboundDeliveryReceivedCaption from './GetInboundDeliveryReceivedCaption';
import libCom from '../../Common/Library/CommonLibrary';
/**
* This function gives preselected filters for IBD
* @param {IClientAPI} context
*/
export default function GetInboundDeliveryPreselectedFilter(context) {
  // Default filter
  let filters = [context.createFilterCriteria(context.filterTypeEnum.Filter, 'IBD', [GetInboundDeliveryOpenCaption(context)],['PickedQuantity ne Quantity'], true)];

  if (libCom.getStateVariable(context, 'BulkUpdateItem') > 0) {
    filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'IBD', [GetInboundDeliveryReceivedCaption(context)],['Quantity gt -2'], true));
    libCom.removeStateVariable(context, 'BulkUpdateItem'); 
  }
  return filters;
}

