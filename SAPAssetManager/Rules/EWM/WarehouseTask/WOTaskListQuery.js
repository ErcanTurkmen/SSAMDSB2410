/** @param {IClientAPI} context  */
export default function WOTaskListQuery(context)  {
     const pageProxy = context.getPageProxy();
     pageProxy.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/WarehouseOrdersListViewNav.action');
}
