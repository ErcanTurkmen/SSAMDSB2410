import { MovementTypes, AccountAssignments } from '../Common/Library/InventoryLibrary';
/**
 * @param {import('./ItemsData').ItemType} item */
export default function ItemDetailsTargetKeyValues(context, item) {
    /** Reservations common fields array */
    const reservationItemCommonFields = [
        keyValues.PLantSLoc,
        keyValues.material,
        keyValues.material_description,
        keyValues.quantity,
        keyValues.requirement_date,
        keyValues.stock_type,
        keyValues.storage_bin,
        keyValues.batch,
        keyValues.valuation_type,
        keyValues.gl_account,
    ];

    const logger = context.getLogger();

    if (item['@odata.type'].includes('PhysicalInventoryDocItem')) {  // PhysicalInventoryItemDetailsVisible
        return [keyValues.item, keyValues.stock_type, keyValues.pi_material, keyValues.pi_quantity, keyValues.storage_bin, keyValues.batch, keyValues.pi_zero_count, keyValues.pi_serialized];
    } else if (['ReservationItem', 'ProductionOrderComponent'].some(t => item['@odata.type'].includes(t)) && (item.MovementType === MovementTypes.t261 || item.MovementType === MovementTypes.t531)) { // Reservation261ItemDetailsVisible
        return [...reservationItemCommonFields, keyValues.cost_center, keyValues.order, keyValues.goods_recipient, keyValues.unloading_point];
    } else if (['ReservationItem', 'ProductionOrderComponent'].some(t => item['@odata.type'].includes(t)) && item.MovementType === MovementTypes.t221) { // Reservation221ItemDetailsVisible
        return [...reservationItemCommonFields, keyValues.reservation_item_wbs_element];
    } else if (['ReservationItem', 'ProductionOrderComponent'].some(t => item['@odata.type'].includes(t)) && item.MovementType === MovementTypes.t281) { // Reservation281ItemDetailsVisible
        return [...reservationItemCommonFields, keyValues.reservation_item_network];
    } else if (['ReservationItem', 'ProductionOrderComponent'].some(t => item['@odata.type'].includes(t)) && item.MovementType === MovementTypes.t201) { // Reservation201ItemDetailsVisible
        return [...reservationItemCommonFields, keyValues.cost_center];
    } else if (['ReservationItem', 'ProductionOrderComponent'].some(t => item['@odata.type'].includes(t))) {
        logger.log('Using default fields for ReservationItem or ProductionOrderComponent', 'Warn');
        return reservationItemCommonFields;
    } else if (['DeliveryItem', 'ProductionOrderItem'].some(t => item['@odata.type'].includes(t))) { // OutboundInboundItemDetailsVisible
        return [keyValues.item, keyValues.PLantSLoc, keyValues.material, keyValues.material_description, keyValues.quantity_uom, keyValues.stock_type, keyValues.storage_bin, keyValues.batch, keyValues.valuation_type];
    }
    return undefined;

}

export function AccountAssignmentTargetKeyValues(item) {
    if (item['@odata.type'].includes('PurchaseOrderItem')) { // POItemDetailsVisible
        switch (item.AcctAssgmtCat) {
            case AccountAssignments.CostCenter:
                return [keyValues.gl_account, keyValues.cost_center];
            case AccountAssignments.Order:
                return [keyValues.gl_account, keyValues.cost_center, keyValues.acc_order];
            case AccountAssignments.Network:
                return [keyValues.gl_account, keyValues.network, keyValues.network_activity];
            case AccountAssignments.Project:
                return [keyValues.gl_account, keyValues.reservation_item_wbs_element];
            default:
                return undefined;
        }
    }
}

const keyValues = {
    item: {
        'KeyName': '$(L,item)',
        'Value': '$(DV,{ItemNum},-)',
    },
    stock_type: {
        'KeyName': '$(L,stock_type)',
        'Value': '$(DV,{StockType},-)',
    },
    quantity: {
        'KeyName': '$(L,quantity)',
        'Value': '$(DV,{QuantityUOM},-)',
    },
    pi_quantity: {
        'KeyName': '$(L,quantity)/$(L,uom)',
        'Value': '$(DV,{EntryQuantity},-)/$({EntryUOM})',
    },
    quantity_uom: {
        'KeyName': '$(L,quantity)/$(L,uom)',
        'Value': '$(DV,{QuantityUOM},-)',
    },
    storage_bin: {
        'KeyName': '$(L,storage_bin)',
        'Value': '$(DV,{StorageBin},-)',
    },
    batch: {
        'KeyName': '$(L,batch)',
        'Value': '$(DV,{Batch},-)',
    },
    pi_zero_count: {
        'KeyName': '$(L, pi_zero_count)',
        'Value': '$(DV,{ZeroCount},-)',
    },
    pi_serialized: {
        'KeyName': '$(L,pi_serialized)',
        'Value': '$(DV,{Serialized},-)',
    },
    pr_group: {
        'KeyName': '$(L,pr_group)',
        'Value': '$(DV,{PRGroupOrg},-)',
    },
    requested_by: {
        'KeyName': '$(L,requested_by)',
        'Value': '$(DV,{Requisitioner},-)',
    },
    plant: {
        'KeyName': '$(L,plant)',
        'Value': '$(DV,{PlantName},-)',
    },
    storage_location: {
        'KeyName': '$(L,storage_location)',
        'Value': '$(DV,{SlocName},-)',
    },
    price_unit_currency: {
        'KeyName': '$(L,price_unit_currency)',
        'Value': '$(DV,{PriceDetails},-)',
    },
    account_assignment_category: {
        'KeyName': '$(L,account_assignment_category)',
        'Value': "$(DV,'/SAPAssetManager/Rules/Inventory/Item/GetAccountAssignmentCategory.js','-')",
    },
    batch_number: {
        'KeyName': '$(L,batch_number)',
        'Value': '$(DV,{Batch},-)',
    },
    valuation_type: {
        'KeyName': '$(L,valuation_type)',
        'Value': '$(DV,{ValuationType},-)',
    },
    item_category: {
        'KeyName': '$(L,item_category)',
        'Value': "$(DV,'/SAPAssetManager/Rules/Inventory/Item/GetItemCategory.js','-')",
    },
    fixed_vendor: {
        'KeyName': '$(L,fixed_vendor)',
        'Value': "$(DV,'/SAPAssetManager/Rules/Inventory/Item/GetFixedVendor.js','-')",
    },
    delivery_date: {
        'KeyName': '$(L,delivery_date)',
        'Value': "$(DV,'/SAPAssetManager/Rules/Inventory/Item/GetDeliveryDate.js','-')",
    },
    requirement_date: {
        'KeyName': '$(L,requirement_date)',
        'Value': "$(DV,'/SAPAssetManager/Rules/Inventory/Item/GetRequirementDate.js','-')",
    },
    desired_supplier: {
        'KeyName': '$(L,desired_supplier)',
        'Value': "$(DV,'/SAPAssetManager/Rules/Inventory/Item/GetDesiredVendor.js','-')",
    },
    postal_code_city: {
        'KeyName': '$(L,postal_code_city)',
        'Value': '$(DV,{PostalCodeCity},-)',
    },
    country: {
        'KeyName': '$(L,country)',
        'Value': '$(DV,{Country},-)',
    },
    region: {
        'KeyName': '$(L,region)',
        'Value': '$(DV,{Region},-)',
    },
    LongText: {
        'Value': '$(DV,{LongText},-)',
    },
    PLantSLoc: {
        'KeyName': '$(L,plant_storage_location)',
        'Value': '$(DV,{PLantSLoc},-)',
    },
    material: {
        'KeyName': '$(L,material)',
        'Value': '$(DV,{Material},-)',
    },
    material_description: {
        'KeyName': '$(L,material_description)',
        'Value': '$(DV,{MaterialDesc},-)',
    },
    pi_material: {
        'KeyName': '$(L,material)',
        'Value': '/SAPAssetManager/Rules/Inventory/Item/GetMaterial.js',
    },
    vendor: {
        'KeyName': '$(L,vendor)',
        'Value': '$(DV,{Vendor},-)',
    },
    supply_plant: {
        'KeyName': '$(L,supply_plant)',
        'Value': '$(DV,{SupplyPlant},-)',
    },
    gl_account: {
        'KeyName': '$(L, gl_account)',
        'Value': '$(DV,{GLAccount},-)',
    },
    cost_center: {
        'KeyName': '$(L, cost_center)',
        'Value': '$(DV,{CostCenter},-)',
    },
    workorder: {
        'KeyName': '$(L, workorder)',
        'Value': '$(DV,{WorkOrder},-)',
    },
    movement_type: {
        'KeyName': '$(L, movement_type)',
        'Value': '$(DV,{MovementType},-)',
    },
    reservation_item_wbs_element: {
        'KeyName': '$(L, reservation_item_wbs_element)',
        'Value': '$(DV,{WBSElement},-)',
    },
    reservation_item_network: {
        'KeyName': '$(L, reservation_item_network)',
        'Value': '$(DV,{NetworkActivity},-)',
    },
    auto_serial_number: {
        'KeyName': '$(L, auto_serial_number)',
        'Value': '$(DV,{autoSerialNumbers},-)',
    },
    move_plant: {
        'KeyName': '$(L, move_plant)',
        'Value': '$(DV,{MovePlant},-)',
    },
    goods_recipient: {
        'KeyName': '$(L, goods_recipient)',
        'Value': '$(DV,{GoodsRecipient},-)',
    },
    unloading_point: {
        'KeyName': '$(L, unloading_point)',
        'Value': '$(DV,{UnloadingPoint},-)',
    },
    item_text_text: {
        'KeyName': '$(L, item_text_text)',
        'Value': '$(DV,{ItemText},-)',
    },
    move_storage_location: {
        'KeyName': '$(L, move_storage_location)',
        'Value': '$(DV,{MoveStorageLocation},-)',
    },
    move_batch: {
        'KeyName': '$(L, move_batch)',
        'Value': '$(DV,{MoveBatch},-)',
    },
    move_valuation_type: {
        'KeyName': '$(L, move_valuation_type)',
        'Value': '$(DV,{MoveValuationType},-)',
    },
    final_issue: {
        'KeyName': '$(L, final_issue)',
        'Value': '$(DV,{FinalIssue},-)',
    },
    number_of_labels: {
        'KeyName': '$(L, number_of_labels)',
        'Value': '$(DV,{NumOfLabels},-)',
    },
    sales_order: {
        'KeyName': '$(L, sales_order)',
        'Value': '$(DV,{SalesOrderNumber},-)',
    },
    sales_order_item: {
        'KeyName': '$(L, sales_order_item)',
        'Value': '$(DV,{SalesOrderItem},-)',
    },
    movement_reason: {
        'KeyName': '$(L, movement_reason)',
        'Value': '$(DV,{MovementReason},-)',
    },
    specialstock: {
        'KeyName': '$(L, special_stock_indicator)',
        'Value': '$(DV,{SpecialStockIndicatorText},-)',
    },
    order: {
        'KeyName': '$(L, reservation_item_order)',
        'Value': '$(DV,{OrderId},-)',
    },
    country_of_origin: {
        'KeyName': '$(L, po_item_detail_co_origin)',
        'Value': '$(DV,{CRofOrigin},-)',
    },
    shelf_life: {
        'KeyName': '$(L, po_item_detail_shelf_life)',
        'Value': '$(DV,{RemShelfLife},-)',
    },
    acc_order: {
        'KeyName': '$(L, reservation_item_order)',
        'Value': '$(DV,{Order},-)',
    },
    network: {
        'KeyName': '$(L, reservation_item_network)',
        'Value': '$(DV,{Network},-)',
    },
    network_activity: {
        'KeyName': '$(L, reservation_item_activity_number)',
        'Value': '$(DV,{NetworkActivity},-)',
    },
};
