/** @param {IClientAPI} context  */
export default function WOListDetailsQuery(context)  {
     const pageProxy = context.getPageProxy();
     pageProxy.executeAction('/SAPAssetManager/Actions/EWM/WarehouseOrders/WarehouseOrdersListViewNav.action');
}
