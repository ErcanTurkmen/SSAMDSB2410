import libCom from '../../Common/Library/CommonLibrary';
import setCaption from '../Search/InventorySearchSetCaption';
import setCaptionState from '../Common/SetCaptionStateForListPage';
import checkForOnlineSearch from '../Search/CheckForOnlineSearch';
import Logger from '../../Log/Logger';

export default function GetOutboundListQuery(context, queryOnly=false, withSearch=false) {
    let searchString = context.searchString;
    let filter = '';
    let filters = [];
    let queryBuilder;
    let baseQuery = '';
    if (withSearch) {
        baseQuery = libCom.getStateVariable(context,'INVENTORY_BASE_QUERY');
    }
    const dollarFilter = '$filter=';
    let expand = 'OutboundDelivery_Nav,ReservationHeader_Nav,PurchaseOrderHeader_Nav,StockTransportOrderHeader_Nav,InboundDelivery_Nav,PhysicalInventoryDocHeader_Nav,ProductionOrderHeader_Nav/ProductionOrderItem_Nav/Material_Nav,MaterialDocument_Nav,PurchaseRequisitionHeader_Nav/PurchaseRequisitionItem_Nav';

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OnDemandObjects', [], '$orderby=ObjectId').then(results => {
        if (results && results.length > 0) {
            let isFirstRow = true;
            for (let i = 0; i < results.length; i++) {
                let row = results.getItem(i);
                if (row.Action === 'D') {
                    let objId = row.ObjectId;
                    if (isFirstRow && !baseQuery) {
                        baseQuery = `(ObjectId ne '${objId}' and OrderId ne '${objId}')`;
                    } else {
                        baseQuery = baseQuery + ` and (ObjectId ne '${objId}' and OrderId ne '${objId}')`;
                    }
                    isFirstRow = false;
                }
            }
        } else if (results && results.length === 0) {
            let hiddenDocs = libCom.getStateVariable(context, 'IMPersonaRemovedObjectIds') || [];
            if (hiddenDocs.length) {
                let isFirstRow = true;
                hiddenDocs.forEach(objId => {
                    if (isFirstRow && !baseQuery) {
                        baseQuery = `(ObjectId ne '${objId}' and OrderId ne '${objId}')`;
                    } else {
                        baseQuery = baseQuery + ` and (ObjectId ne '${objId}' and OrderId ne '${objId}')`;
                    }
                    isFirstRow = false;
                });
            }
        }
        if (baseQuery) {
            baseQuery = '(' + baseQuery + ')';
        }
        if (queryOnly) {
            if (baseQuery && baseQuery.length > 0) {
                return dollarFilter + baseQuery + '&$expand=' + expand + '&$orderby=ObjectId,GenericObjectId';
            }
            return '$expand=' + expand + '&$orderby=ObjectId,GenericObjectId';
        }
    
        if (!withSearch) {
            queryBuilder = context.dataQueryBuilder();
            libCom.setStateVariable(context,'INVENTORY_CAPTION','IBOB');
            libCom.setStateVariable(context,'INVENTORY_BASE_QUERY', baseQuery);
            libCom.setStateVariable(context,'INVENTORY_ENTITYSET','MyInventoryObjects');
            libCom.setStateVariable(context, 'INVENTORY_LIST_PAGE', 'InboundOutboundListPage');
        }
    
        if (searchString) { //Supporting order number and material number for searches
            let idSearchString = '';
            searchString = searchString.toLowerCase();
            const docYear = context.searchString.length > 4 ? context.searchString.substring(searchString.length - 4, searchString.length) : '';
            if (docYear && docYear.length === 4) {
                idSearchString = searchString.toLowerCase() + '\/' + docYear;
            }
            filters.push(`substringof('${searchString}', tolower(ObjectId))`);
            filters.push(`substringof('${searchString}', tolower(OrderId))`);
            filters.push(`substringof('${idSearchString || searchString}', tolower(GenericObjectId))`);
            if (idSearchString) {
                filters.push(`substringof('${searchString}', tolower(GenericObjectId))`);
            }
            filters.push(`substringof('${searchString}', tolower(PurchaseOrderHeader_Nav/SupplyingPlant))`);
            filters.push(`substringof('${searchString}', tolower(PurchaseOrderHeader_Nav/Vendor_Nav/Name1))`);
            filters.push(`PurchaseOrderHeader_Nav/PurchaseOrderItem_Nav/any(wp : substringof('${searchString}', tolower(wp/MaterialNum)))`);
            filters.push(`substringof('${searchString}', tolower(ReservationHeader_Nav/ReceivingPlant))`);
            filters.push(`substringof('${searchString}', tolower(ReservationHeader_Nav/OrderId))`);
            filters.push(`ReservationHeader_Nav/ReservationItem_Nav/any(wp : substringof('${searchString}', tolower(wp/MaterialNum)))`);
            filters.push(`substringof('${searchString}', tolower(StockTransportOrderHeader_Nav/SupplyingPlant))`);
            filters.push(`substringof('${searchString}', tolower(StockTransportOrderHeader_Nav/Vendor_Nav/Name1))`);
            filters.push(`StockTransportOrderHeader_Nav/StockTransportOrderItem_Nav/any(wp : substringof('${searchString}', tolower(wp/MaterialNum)))`);
            filters.push(`InboundDelivery_Nav/Items_Nav/any(wp : substringof('${searchString}', tolower(wp/Material)))`);
            filters.push(`OutboundDelivery_Nav/Items_Nav/any(wp : substringof('${searchString}', tolower(wp/Material)))`);
        }
        if (filters.length > 0) {
            if (baseQuery) {
                filter = baseQuery + ' and (' + filters.join(' or ') + ')';
            } else {
                filter = '(' + filters.join(' or ') + ')';
            }
        } else {
            filter = baseQuery;
        }
        if (withSearch) {
            if (filter.includes('$filter')) {
                return `${filter}&$expand=${expand}`;
            }
            return `$filter=${filter}&$expand=${expand}`;
        }
        if (filter) {
            queryBuilder.filter(filter);
        }
        queryBuilder.expand(expand);
        queryBuilder.orderBy('ObjectId', 'GenericObjectId');
        libCom.setStateVariable(context,'INVENTORY_SEARCH_FILTER',filter);
    
        setCaptionState(context, 'InboundOutboundListPage'); //Save caption state for this list page
    
        //If this script was called because a filter was just applied, do not run setCaption here
        if (!libCom.getStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED')) {
            return setCaption(context).then(() => {
                return checkForOnlineSearch(context, 'MyInventoryObjects', queryBuilder, context.searchString, 'All');
            });
        }
        libCom.removeStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED');
        return checkForOnlineSearch(context, 'MyInventoryObjects', queryBuilder, context.searchString, 'All');
    })
    .catch(error => {
        Logger.error('Inventory Overview - Inbound List', error);
        return dollarFilter + baseQuery + '&$expand=' + expand;
    });
}
