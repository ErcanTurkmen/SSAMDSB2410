import libCom from '../../Common/Library/CommonLibrary';
import QueryBuilder from '../../Common/Query/QueryBuilder';
import libInv from '../Common/Library/InventoryLibrary';

/**
 * prepare the query for Material documents items and navigate to the details page
 * @param {IClientAPI} context 
 * @returns action result
 */
export default function MaterialDocumentItemDetailsQuery(context) {
    const binding = context.binding;
    const headerType = (binding['@odata.type'] || binding.item['@odata.type']).substring('#sap_mobile.'.length);
    libCom.setStateVariable(context, 'BlockIMNavToMDocHeader', headerType === 'MaterialDocument');

    /** @type {IPageProxy} */
    const pageProxy = context.getPageProxy();
    const actionBinding = pageProxy.getActionBinding();
    
    const entitySet = 'MaterialDocItems';
    // the query: `$filter=MaterialDocNumber eq '${actionBinding.MaterialDocNumber}'&$expand=SerialNum&$orderby=MatDocItem`
    const query = new QueryBuilder([`MaterialDocNumber eq '${actionBinding.MaterialDocNumber}'`],['SerialNum', 'StockTransportOrderItem_Nav'], [], ['orderby=MatDocItem']).build();
    // set bindings
    libInv.SetItemDetailsBinding(context, entitySet, query);

    return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocumentItem/MaterialDocumentItemDetails.action');
}
