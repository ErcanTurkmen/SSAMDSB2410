import QueryBuilder from '../../Common/Query/QueryBuilder';
import libInv from '../Common/Library/InventoryLibrary';

/** @param {IClientAPI} context  */
export default function ProductionOrderItemDetailsQuery(context)  {
    /** @type {IPageProxy} */
    const actionBinding = context.getPageProxy().getActionBinding();
    const entitySet = 'ProductionOrderItems';
    const expand = 'Material_Nav,MaterialDocItem_Nav';
    const filter = `OrderId eq '${actionBinding.OrderId}'`;
 
    let queryBuilder = new QueryBuilder();
    queryBuilder.addExpandStatement(expand);
    queryBuilder.addFilter(filter);
    queryBuilder.addExtra('orderby=ItemNum');
    const query = queryBuilder.build();
   
    // set bindings
    libInv.SetItemDetailsBinding(context, entitySet, query);

    return context.executeAction('/SAPAssetManager/Actions/Inventory/ProductionOrder/ProductionOrderItemDetails.action');
}



