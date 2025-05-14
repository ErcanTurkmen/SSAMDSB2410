import GetOutboundDeliveryOpenCaption from './GetOutboundDeliveryOpenCaption';
import GetOutboundDeliveryIssuedCaption from './GetOutboundDeliveryIssuedCaption';
import libCom from '../../Common/Library/CommonLibrary';
/**
* This function gives preselected filters for OBD
* @param {IClientAPI} context
*/
export default function GetOutboundDeliveryPreselectedFilter(context) {
  // Default filter
  let filters = [context.createFilterCriteria(context.filterTypeEnum.Filter, 'OBD', [GetOutboundDeliveryOpenCaption(context)],['PickedQuantity ne Quantity'], true)];

  if (libCom.getStateVariable(context, 'BulkUpdateItem') > 0) {
    filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'OBD', [GetOutboundDeliveryIssuedCaption(context)],['Quantity gt -2'], true));
    libCom.removeStateVariable(context, 'BulkUpdateItem'); 
  }
  return filters;
}
