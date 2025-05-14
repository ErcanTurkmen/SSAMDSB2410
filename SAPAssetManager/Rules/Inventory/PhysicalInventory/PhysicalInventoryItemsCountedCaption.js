import libCom from '../../Common/Library/CommonLibrary';
import { PI_COUNTED_FILTER } from '../../Inventory/PhysicalInventory/PhysicalInventoryCountNavWrapper';

/**
* This function gives the caption of the physical inventory counted items...
* @param {IClientAPI} context
*/
export default function PhysicalInventoryItemsCountedCaption(context) {
    let pageName = libCom.getPageName(context);
    let baseQuery = libCom.getStateVariable(context,'INVENTORY_BASE_QUERY', pageName);   
    let baseQueryCounted = baseQuery + ' and (' + PI_COUNTED_FILTER + ')';  
    return libCom.getEntitySetCount(context, 'PhysicalInventoryDocItems', baseQueryCounted).then(count => {
        return context.localizeText('counted_x',[count]);
    });   
}
