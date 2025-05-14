import ServiceOrderSalesOrg from '../../ServiceOrders/ServiceOrderSalesOrg';
import GetSIServiceContractValue from './GetSIServiceContractValue';

export default async function ServiceContractItemQuery(clientAPI, serviceOrderId, srContract) {
    const serviceContract = srContract || GetSIServiceContractValue(clientAPI);
    const salesOrg = await ServiceOrderSalesOrg(clientAPI, serviceOrderId);
    let orderBy = '$orderby=ItemNo';
    if (serviceContract && salesOrg) {
        return `$filter=ObjectID eq '${serviceContract}' and SalesOrg eq '${salesOrg}'&${orderBy}`;
    }
    return orderBy;
}
