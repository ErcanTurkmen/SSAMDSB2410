import QueryBuilder from '../../Common/Query/QueryBuilder';
import libInv from '../Common/Library/InventoryLibrary';

export default function ReservationItemProductionOrderComponentDetailsQuery(context) {
    const actionBinding = context.getPageProxy().getActionBinding();
    const isRes = actionBinding['@odata.type'].substring('#sap_mobile.'.length) === 'ReservationItem';
    const entitySet = isRes ? 'ReservationItems' : 'ProductionOrderComponents';
    const expandStatement = isRes ? 'ReservationHeader_Nav,MaterialPlant_Nav,MaterialDocItem_Nav/SerialNum' : 'MaterialDocItem_Nav';
    const filter = isRes ? `ReservationNum eq '${actionBinding.ReservationNum}'` : `OrderId eq '${actionBinding.OrderId}'`;

    let queryBuilder = new QueryBuilder();
    queryBuilder.addExpandStatement(expandStatement);
    queryBuilder.addFilter(filter);
    queryBuilder.addExtra('orderby=ItemNum');
    const query = queryBuilder.build();

    // set bindings
    libInv.SetItemDetailsBinding(context, entitySet, query); 

    return context.executeAction('/SAPAssetManager/Actions/Inventory/Reservation/ReservationItemProductionOrderComponentDetails.action');
}
