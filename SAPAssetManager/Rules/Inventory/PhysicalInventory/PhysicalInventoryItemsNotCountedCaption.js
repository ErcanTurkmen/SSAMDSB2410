import libCom from '../../Common/Library/CommonLibrary';
import { PI_NOT_COUNTED_FILTER } from '../../Inventory/PhysicalInventory/PhysicalInventoryCountNavWrapper';

/**
* This function gives the count of the physical inventory not counted items...
* @param {IClientAPI} context
*/
export default function PhysicalInventoryItemsNotCountedCaption(context) {
    let pageName = libCom.getPageName(context);
    let baseQuery = libCom.getStateVariable(context,'INVENTORY_BASE_QUERY', pageName);
    let baseQueryNotCounted = baseQuery + ' and (' + PI_NOT_COUNTED_FILTER + ')';    
    return libCom.getEntitySetCount(context, 'PhysicalInventoryDocItems', baseQueryNotCounted).then(count => {
        return context.localizeText('pi_uncounted_x',[count]); 
    });   
}
