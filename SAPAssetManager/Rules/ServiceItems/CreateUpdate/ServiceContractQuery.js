import ServiceOrderSalesOrgValue from '../../ServiceOrders/CreateUpdate/ServiceOrderSalesOrgValue';
import ServiceOrderSalesOrg from '../../ServiceOrders/ServiceOrderSalesOrg';
import IsItemCreateFromServiceItemsList from './IsItemCreateFromServiceItemsList';

// Query options for service contract based on selected service object
export default async function ServiceContractQuery(clientAPI, serviceObjectId) {
    let query = '$orderby=ObjectID';

    let salesOrg;
    if (IsItemCreateFromServiceItemsList(clientAPI)) {
        salesOrg = await ServiceOrderSalesOrg(clientAPI, serviceObjectId);
    } else {
        salesOrg = await ServiceOrderSalesOrgValue(clientAPI);
    }

    if (salesOrg) {
        query += `&$filter=SalesOrg eq '${salesOrg}'`;
    }

    return query;
}
