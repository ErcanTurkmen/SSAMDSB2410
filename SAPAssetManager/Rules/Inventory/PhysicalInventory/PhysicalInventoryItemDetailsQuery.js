import libCom from '../../Common/Library/CommonLibrary';
import libInv from '../Common/Library/InventoryLibrary';
import QueryBuilder from '../../Common/Query/QueryBuilder';
/** @param {IClientAPI} context  */
export default function PhysicalInventoryItemDetailsQuery(context) {
    /** @type {IPageProxy} */
    const pageProxy = context.getPageProxy();
    const actionBinding = pageProxy.getActionBinding();
    const entitySet = 'PhysicalInventoryDocItems';
    const select = '*,MaterialSLoc_Nav/StorageBin,MaterialPlant_Nav/SerialNumberProfile,Material_Nav/Description';
    const expand = 'MaterialPlant_Nav,MaterialSLoc_Nav,Material_Nav,PhysicalInventoryDocItemSerial_Nav,PhysicalInventoryDocHeader_Nav';
 
    let baseQuery = "(PhysInvDoc eq '" + actionBinding.PhysInvDoc + "' and FiscalYear eq '" + actionBinding.FiscalYear + "')";
    const sectionedTableFilterTerm = libCom.GetSectionedTableFilterTerm(context.getPageProxy().getControl('SectionedTable'));
    if (sectionedTableFilterTerm) {
        baseQuery = baseQuery + ' and (' + sectionedTableFilterTerm + ')';
    }
 
    let queryBuilder = new QueryBuilder();
    queryBuilder.addSelectStatement(select);
    queryBuilder.addFilter(baseQuery);
    queryBuilder.addExpandStatement(expand);
    queryBuilder.addExtra('orderby=Item');
    const query = queryBuilder.build();

    // set bindings
    libInv.SetItemDetailsBinding(context, entitySet, query);
    
    return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDetails.action');
}



