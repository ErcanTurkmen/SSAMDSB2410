import ServiceOrderSalesOrgValue from '../../ServiceOrders/CreateUpdate/ServiceOrderSalesOrgValue';

/**
* Gets value from sales org scenario list picker and gets Sales Org value
* @param {IClientAPI} context
*/
export default function ServiceQuotationSalesOrgValue(context) {
    return ServiceOrderSalesOrgValue(context, 'ServiceQuotationCreateUpdatePage');
}
