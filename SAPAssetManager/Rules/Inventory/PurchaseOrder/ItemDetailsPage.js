import libCom from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import { AccountAssignmentTargetKeyValues, default as ItemDetailsTargetKeyValues } from '../Item/ItemDetailsTargetKeyValues';
import libInv from '../Common/Library/InventoryLibrary';

/** @param {IClientAPI} context  */
export default function ItemDetailsPage(context) {
    const binding = context.binding;
    const headerType = (binding['@odata.type'] || binding.item['@odata.type']).substring('#sap_mobile.'.length);
    const headers = ['ReservationHeader', 'PurchaseOrderHeader', 'StockTransportOrderHeader', 'ProductionOrderHeader', 'PurchaseRequisitionHeader'];
    /** @type {IPageProxy} */
    const pageProxy = context.getPageProxy();
    const actionBinding = pageProxy.getActionBinding();
    const type = actionBinding['@odata.type'].substring('#sap_mobile.'.length);

    let entitySet = '';
    let query = '';

    handleMaterialDocument(headerType, context);

    if (headers.includes(headerType) && type === 'MaterialDocItem') {
        libCom.setStateVariable(context, 'ClosePageCount', 2);
    } else {
        libCom.setStateVariable(context, 'ClosePageCount', 3);
    }

    if (type === 'PurchaseOrderItem') {
        entitySet = 'PurchaseOrderItems';
        query = `$filter=PurchaseOrderId eq '${actionBinding.PurchaseOrderId}'&$expand=ScheduleLine_Nav,MaterialPlant_Nav,POSerialNumber_Nav,PurchaseOrderHeader_Nav,MaterialDocItem_Nav/SerialNum&$orderby=ItemNum`;
    } else if (type === 'PurchaseRequisitionItem') {
        entitySet = 'PurchaseRequisitionItems';
        query = `$filter=PurchaseReqNo eq '${actionBinding.PurchaseReqNo}'&$expand=PurchaseRequisitionLongText_Nav,PurchaseRequisitionAddress_Nav,PurchaseRequisitionAcctAsgn_Nav,PurchaseRequisitionHeader_Nav&$orderby=PurchaseReqItemNo`;
    } else if (type === 'StockTransportOrderItem') {
        entitySet = 'StockTransportOrderItems';
        query = `$filter=StockTransportOrderId eq '${actionBinding.StockTransportOrderId}'&$expand=MaterialPlant_Nav,StockTransportOrderHeader_Nav,STOScheduleLine_Nav,STOSerialNumber_Nav,MaterialDocItem_Nav/SerialNum&$orderby=ItemNum`;
    } else if (type === 'ReservationItem') {
        entitySet = 'ReservationItems';
        query = `$expand=ReservationHeader_Nav,MaterialPlant_Nav,MaterialDocItem_Nav/SerialNum&$filter=ReservationNum eq '${actionBinding.ReservationNum}'&$orderby=ItemNum`;
    } else if (type === 'ProductionOrderItem') {
        entitySet = 'ProductionOrderItems';
        query = `$expand=Material_Nav,MaterialDocItem_Nav&$filter=OrderId eq '${actionBinding.OrderId}'&$orderby=ItemNum`;
    } else if (type === 'ProductionOrderComponent') {
        entitySet = 'ProductionOrderComponents';
        query = `$expand=MaterialDocItem_Nav&$filter=OrderId eq '${actionBinding.OrderId}'&$orderby=ItemNum`;
    } else if (type === 'InboundDeliveryItem') {
        entitySet = 'InboundDeliveryItems';
        query = `$filter=DeliveryNum eq '${actionBinding.DeliveryNum}'&$expand=InboundDeliverySerial_Nav,MaterialPlant_Nav,InboundDelivery_Nav&$orderby=Item`;
    } else if (type === 'OutboundDeliveryItem') {
        entitySet = 'OutboundDeliveryItems';
        query = `$filter=DeliveryNum eq '${actionBinding.DeliveryNum}'&$expand=OutboundDeliverySerial_Nav,MaterialPlant_Nav,OutboundDelivery_Nav&$orderby=Item`;
    } else if (type === 'MaterialDocItem') {
        entitySet = 'MaterialDocItems';
        query = `$filter=MaterialDocNumber eq '${actionBinding.MaterialDocNumber}'&$expand=SerialNum&$orderby=MatDocItem`;
    } else if (type === 'PhysicalInventoryDocItem') {
        entitySet = 'PhysicalInventoryDocItems';
        const select = '*,MaterialSLoc_Nav/StorageBin,MaterialPlant_Nav/SerialNumberProfile,Material_Nav/Description';
        const expand = 'MaterialPlant_Nav,MaterialSLoc_Nav,Material_Nav,PhysicalInventoryDocItemSerial_Nav';
        const orderBy = 'Item';
        let baseQuery = "(PhysInvDoc eq '" + actionBinding.PhysInvDoc + "' and FiscalYear eq '" + actionBinding.FiscalYear + "')";
        const sectionedTableFilterTerm = libCom.GetSectionedTableFilterTerm(context.getPageProxy().getControl('SectionedTable'));
        if (sectionedTableFilterTerm) {
            baseQuery = baseQuery + ' and (' + sectionedTableFilterTerm + ')';
        }
        query = '$select=' + select + '&$filter=' + baseQuery + '&$expand=' + expand + '&$orderby=' + orderBy;
    }

    // set bindings
    libInv.SetItemDetailsBinding(context, entitySet, query);
    
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Inventory/Item/ItemDetails.action',
        'Properties': {
            'PageMetadata': GetDetailsPageMetadata(context, actionBinding),
        },
    });
}

function GetDetailsPageMetadata(context, binding) {
    const keysValues = ItemDetailsTargetKeyValues(context, binding);
    const acctKeysValues = AccountAssignmentTargetKeyValues(binding);
    const itemDetailsPageDef = context.getPageDefinition('/SAPAssetManager/Pages/Inventory/Item/ItemDetails.page');
    const sectionedTable = itemDetailsPageDef.Controls.find(c => c._Name === 'SectionedTable');
    if (ValidationLibrary.evalIsEmpty(keysValues)) {
        sectionedTable.Sections.splice(sectionedTable.Sections.indexOf(x => x._Name === 'PhysicalInventoryDetailsSection'), 1);
    } else {
        const detailsSection = sectionedTable.Sections.find(x => x._Name === 'PhysicalInventoryDetailsSection');
        detailsSection.KeyAndValues.push(...keysValues);
        if (acctKeysValues) {
            const acctAssgmtSection = sectionedTable.Sections.find(x => x._Name === 'AccountAssignmentSection');
            acctAssgmtSection.KeyAndValues.push(...acctKeysValues);
        }
    }
    return itemDetailsPageDef;
}

function handleMaterialDocument(headerType, context) {
    if (headerType === 'MaterialDocument') {
        libCom.setStateVariable(context, 'BlockIMNavToMDocHeader', true);
    } else {
        libCom.setStateVariable(context, 'BlockIMNavToMDocHeader', false);
    }
}
