import autoOpenMovementScreen from '../Search/AutoOpenMovementScreen';
import CommonLibrary from '../../Common/Library/CommonLibrary';
/**
 * Common rule to build queries for PO, STO, PRD and RS items
 * @param {*} context PO, STO, PRD or RS objects
 * @returns DataQueryBuilder
 */
export default function GetItemsListQuery(context) {
    let queryBuilder = context.dataQueryBuilder();

    let searchString = context.searchString;
    if (searchString) {
        searchString = context.searchString.toLowerCase();
    }

    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'PurchaseRequisitionHeader') {
        queryBuilder.orderBy('PurchaseReqItemNo');
        return getPRItemsQuery(context, queryBuilder, searchString);
    } else {
        queryBuilder.orderBy('ItemNum');
    }
    if (type === 'PurchaseOrderHeader') {
        return getPurchaseOrderItemsQuery(context, queryBuilder, searchString);
    } else if (type === 'StockTransportOrderHeader') {
        return getSTOItemsQuery(context, queryBuilder, searchString);
    } else if (type === 'ReservationHeader') {
        return getReservationItemsQuery(context, queryBuilder, searchString);
    } else if (type === 'ProductionOrderHeader') {
        return getPRDItemsQuery(context, queryBuilder, searchString);
    }
}

function getPurchaseOrderItemsQuery(context, queryBuilder, searchString) {
    queryBuilder.filter("(PurchaseOrderId eq '" + context.binding.PurchaseOrderId + "')");
    queryBuilder.expand('MaterialPlant_Nav', 'ScheduleLine_Nav', 'PurchaseOrderHeader_Nav', 'POSerialNumber_Nav', 'MaterialDocItem_Nav/PurchaseOrderItem_Nav', 'MaterialDocItem_Nav/SerialNum');

    let tabFilters = context.filters;
    let tabGroups;
    let appFilter;
    if (tabFilters) {
        tabGroups = tabFilters.map(val => val.filterItems[0]);
        if (tabGroups && tabGroups.includes('1 gt -1') && !tabGroups.includes('2 gt -2')) {
            appFilter = "((OpenQuantity gt 0) and (FinalDeliveryFlag ne 'X'))";
            queryBuilder.filter(appFilter);
        } else if (tabGroups && !tabGroups.includes('1 gt -1') && tabGroups.includes('2 gt -2')) {
            appFilter = "((OpenQuantity eq 0) or (FinalDeliveryFlag eq 'X'))";
            queryBuilder.filter(appFilter);
        }
    }
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(PurchaseOrderHeader_Nav/SupplyingPlant))`,
            `substringof('${searchString}', tolower(PurchaseOrderHeader_Nav/Vendor_Nav/Name1))`,
            `substringof('${searchString}', tolower(MaterialNum))`,
            `substringof('${searchString}', tolower(StorageLoc))`,
            `substringof('${searchString}', tolower(Plant))`,
            `substringof('${searchString}', tolower(StockType))`,
            `substringof('${searchString}', tolower(ItemNum))`,
            `ScheduleLine_Nav/any(wp : substringof('${searchString}', tolower(wp/Batch)) and (wp/ScheduleLine eq '0001'))`,
            `MaterialPlant_Nav/MaterialSLocs/any(wp : substringof('${searchString}', tolower(wp/StorageBin)) and (wp/StorageLocation eq StorageLoc))`,
            `substringof('${searchString}', tolower(Material_Nav/Description))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    return autoOpenMovementScreen(context, 'PurchaseOrderItems', queryBuilder, searchString);
}

function getSTOItemsQuery(context, queryBuilder, searchString) {
    queryBuilder.filter("(StockTransportOrderId eq '" + context.binding.StockTransportOrderId + "')");
    queryBuilder.expand('MaterialPlant_Nav', 'StockTransportOrderHeader_Nav', 'STOScheduleLine_Nav', 'STOSerialNumber_Nav', 'MaterialDocItem_Nav/SerialNum', 'MaterialDocItem_Nav/StockTransportOrderItem_Nav');
    let plant = CommonLibrary.getDefaultUserParam('USER_PARAM.WRK');
    let tabFilters = context.filters;
    let tabGroups;
    let appFilter;
    if (tabFilters) {
        tabGroups = tabFilters.map(val => val.filterItems[0]);
        if (tabGroups && tabGroups.includes('1 gt -1') && !tabGroups.includes('2 gt -2')) {
            appFilter = getAppFilterForFirstGroup(plant, context);
            queryBuilder.filter(appFilter);
        } else if (tabGroups && !tabGroups.includes('1 gt -1') && tabGroups.includes('2 gt -2')) {
            appFilter = getAppFilterForSecondGroup(plant, context);
            queryBuilder.filter(appFilter);
        }
    }
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(ItemText))`,
            `substringof('${searchString}', tolower(ItemNum))`,
            `substringof('${searchString}', tolower(MaterialNum))`,
            `substringof('${searchString}', tolower(Plant))`,
            `substringof('${searchString}', tolower(StockType))`,
            `substringof('${searchString}', tolower(StorageLoc))`,
            `STOScheduleLine_Nav/any(wp : substringof('${searchString}', tolower(wp/Batch)) and (wp/ScheduleLine eq '0001'))`,
            `MaterialPlant_Nav/MaterialSLocs/any(wp : substringof('${searchString}', tolower(wp/StorageBin)) and (wp/StorageLocation eq StorageLoc))`,
            `substringof('${searchString}', tolower(Material_Nav/Description))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    return autoOpenMovementScreen(context, 'StockTransportOrderItems', queryBuilder, searchString);
}

function getAppFilterForFirstGroup(plant, context) {
    let appFilter;
    if (plant && plant === context.binding.SupplyingPlant) {
        appFilter = "(((OrderQuantity eq IssuedQuantity) and (IssuedQuantity eq 0)) or ((OrderQuantity gt IssuedQuantity) and (FinalDeliveryFlag ne 'X' and DeliveryCompletedFlag ne 'X')))";
    } else {
        appFilter = "(((OrderQuantity eq ReceivedQuantity) and (ReceivedQuantity eq 0)) or ((OrderQuantity gt ReceivedQuantity) and (FinalDeliveryFlag ne 'X' and DeliveryCompletedFlag ne 'X')))";
    }
    return appFilter;
}

function getAppFilterForSecondGroup(plant, context) {
    let appFilter;
    if (plant && plant === context.binding.SupplyingPlant) {
        appFilter = "(((OrderQuantity eq IssuedQuantity) and (IssuedQuantity ne 0)) or ((OrderQuantity gt IssuedQuantity) and (FinalDeliveryFlag eq 'X' or DeliveryCompletedFlag eq 'X')))";
    } else {
        appFilter = "(((OrderQuantity eq ReceivedQuantity) and (ReceivedQuantity ne 0)) or ((OrderQuantity gt ReceivedQuantity) and (FinalDeliveryFlag eq 'X' or DeliveryCompletedFlag eq 'X')))";
    }
    return appFilter;
}

function getReservationItemsQuery(context, queryBuilder, searchString) {
    queryBuilder.filter("(ReservationNum eq '" + context.binding.ReservationNum + "')");
    queryBuilder.expand('MaterialPlant_Nav/Material', 'ReservationHeader_Nav', 'MaterialDocItem_Nav');
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(ItemNum))`,
            `substringof('${searchString}', tolower(MaterialNum))`,
            `substringof('${searchString}', tolower(Batch))`,
            `substringof('${searchString}', tolower(StorageBin))`,
            `substringof('${searchString}', tolower(SupplyPlant))`,
            `substringof('${searchString}', tolower(SupplyStorageLocation))`,
            `substringof('${searchString}', tolower(RecordType))`,
            `substringof('${searchString}', tolower(MaterialPlant_Nav/Material/Description))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    return autoOpenMovementScreen(context, 'ReservationItems', queryBuilder, searchString);
}

function getPRDItemsQuery(context, queryBuilder, searchString) {
    queryBuilder.filter("(OrderId eq '" + context.binding.OrderId + "')");
    queryBuilder.expand('Material_Nav', 'ProductionOrderSerial_Nav', 'ProductionOrderHeader_Nav', 'MaterialPlant_Nav', 'MaterialDocItem_Nav');
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(ItemNum))`,
            `substringof('${searchString}', tolower(MaterialNum))`,
            `substringof('${searchString}', tolower(Material_Nav/Description))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    return autoOpenMovementScreen(context, 'ProductionOrderItems', queryBuilder, searchString);
}

function getPRItemsQuery(context, queryBuilder, searchString) {
    queryBuilder.filter("(PurchaseReqNo eq '" + context.binding.PurchaseReqNo + "')");
    queryBuilder.expand('PurchaseRequisitionLongText_Nav,PurchaseRequisitionAddress_Nav,PurchaseRequisitionAcctAsgn_Nav,PurchaseRequisitionHeader_Nav');
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(PurchaseReqItemNo))`,
            `substringof('${searchString}', tolower(Plant))`,
            `substringof('${searchString}', tolower(StorageLocation))`,
            `substringof('${searchString}', tolower(ShortText))`,
            `substringof('${searchString}', tolower(Material))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    return autoOpenMovementScreen(context, 'PurchaseRequisitionItems', queryBuilder, searchString);
}
