import QueryBuilder from '../../Common/Query/QueryBuilder';
import libInv from '../Common/Library/InventoryLibrary';

/** @param {IClientAPI} context  */
export default function InboundOutboundDeliveryItemDetailsQuery(context) {
    const actionBinding = context.getPageProxy().getActionBinding();
    const isIBD = actionBinding['@odata.type'].substring('#sap_mobile.'.length) === 'InboundDeliveryItem';
    const entitySet = isIBD ? 'InboundDeliveryItems' : 'OutboundDeliveryItems';
    const expandStatement = isIBD ? 'InboundDeliverySerial_Nav,MaterialPlant_Nav,InboundDelivery_Nav' : 'OutboundDeliverySerial_Nav,MaterialPlant_Nav,OutboundDelivery_Nav';
    const baseQuery = `DeliveryNum eq '${actionBinding.DeliveryNum}'`;

    let queryBuilder = new QueryBuilder();
    queryBuilder.addExpandStatement(expandStatement);
    queryBuilder.addFilter(baseQuery);
    queryBuilder.addExtra('orderby=Item');
    const query = queryBuilder.build();

   // set bindings
   libInv.SetItemDetailsBinding(context, entitySet, query);
       
    return context.executeAction('/SAPAssetManager/Actions/Inventory/InboundOutbound/InboundOutboundDeliveryItemDetailsNav.action');
}
