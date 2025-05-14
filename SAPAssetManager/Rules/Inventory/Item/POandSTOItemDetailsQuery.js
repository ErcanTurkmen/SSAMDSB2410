import QueryBuilder from '../../Common/Query/QueryBuilder';
import logger from '../../Log/Logger';
import libInv from '../Common/Library/InventoryLibrary';

export default function POandSTOItemDetailsQuery(context) {
    /** @type {IPageProxy} */
    const pageProxy = context.getPageProxy();
    const actionBinding = pageProxy.getActionBinding();
    const type = actionBinding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'PurchaseOrderItem') {
        return PurchaseOrderItemDetailsQuery(context, actionBinding);
    } else if (type === 'StockTransportOrderItem') {
        return STOItemDetailsQuery(context, actionBinding);
    } else {
        logger.error(`Unsupported action binding type: ${type}`);
    }
}

/**
 * prepare the query for Purchase Order items and navigate to the details page
 * @param {IClientAPI} context 
 * @returns action result
 */
function PurchaseOrderItemDetailsQuery(context, actionBinding) {
    const entitySet = 'PurchaseOrderItems';
    // the query: `$filter=PurchaseOrderId eq '${actionBinding.PurchaseOrderId}'&$expand=ScheduleLine_Nav,MaterialPlant_Nav,POSerialNumber_Nav,PurchaseOrderHeader_Nav,MaterialDocItem_Nav/SerialNum&$orderby=ItemNum`
    const query = new QueryBuilder([`PurchaseOrderId eq '${actionBinding.PurchaseOrderId}'`],['ScheduleLine_Nav', 'MaterialPlant_Nav', 'POSerialNumber_Nav', 'PurchaseOrderHeader_Nav', 'MaterialDocItem_Nav/SerialNum'], [], ['orderby=ItemNum']).build();
   
    // set bindings
    libInv.SetItemDetailsBinding(context, entitySet, query);
    
    return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseOrder/PurchaseOrderItemDetailsNav.action');
}

/**
 * prepare the query for STO items and navigate to the details page
 * @param {IClientAPI} context 
 * @returns action result
 */
function STOItemDetailsQuery(context, actionBinding) {
    const entitySet = 'StockTransportOrderItems';
    const query = `$filter=StockTransportOrderId eq '${actionBinding.StockTransportOrderId}'&$expand=MaterialPlant_Nav,MaterialPlant_Nav/MaterialSLocs,StockTransportOrderHeader_Nav,STOScheduleLine_Nav,STOSerialNumber_Nav,MaterialDocItem_Nav/SerialNum&$orderby=ItemNum`;

    // set bindings
    libInv.SetItemDetailsBinding(context, entitySet, query);

    // /** @type {import('../Item/ItemsData').ItemDetailsBinding} */
    // const newActionBinding = { ItemsQuery: { entitySet, query }, item: actionBinding };
    // context.getPageProxy().setActionBinding(newActionBinding);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/StockTransportOrder/StockTransportOrderItemDetails.action');
}

