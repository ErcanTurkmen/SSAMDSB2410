import ServiceOrderSalesRespOrgValue from '../../ServiceOrders/CreateUpdate/ServiceOrderSalesRespOrgValue';

/**
* Gets value from sales org scenario list picker and gets Sales Org value
* @param {IClientAPI} context
*/
export default function ServiceQuotationSalesRespOrgValue(context) {
    return ServiceOrderSalesRespOrgValue(context, 'ServiceQuotationCreateUpdatePage');
}
