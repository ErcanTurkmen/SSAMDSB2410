import { GetEDTColumns, GetEDTItems, GetItemEDTSection, GetItemSearchAndSelectSection, GetItemTitleDescriptionSection } from './BulkIssueOrReceiptPageMetadata';
import { GetOpenItemsTargetQuery } from './BulkUpdateLibrary';
import GetItemTextOrMaterialName from '../../Common/GetItemTextOrMaterialName';
import libCom from '../../../Common/Library/CommonLibrary';
import GetItemFootnote from '../../PurchaseOrder/GetItemFootnote';
import libVal from '../../../Common/Library/ValidationLibrary';
import QueryBuilder from '../../../Common/Query/QueryBuilder';
import SelectAllHeight from './SelectAllHeight';
import ItemHeaderHeight from './ItemHeaderHeight';
import EDTHeight, { EDTColumnWidth } from './EDTConfigurations';
import EDTSoftInputModeConfig from '../../../Extensions/EDT/EDTSoftInputModeConfig';

export default function BulkIssueOrReceiptCreatePageMetadataGenerator(clientAPI) {
    EDTSoftInputModeConfig(clientAPI);

    let page = clientAPI.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOrReceiptCreate.page');
    if (clientAPI.getPageProxy().getActionBinding()) {
        clientAPI._context.binding = clientAPI.getPageProxy().getActionBinding();
    }
    return GetItems(clientAPI).then((items) => {
        if (items) {
            addSections(clientAPI, page, items);
        }
        return page;
    });
}

function addItemSearchAndSelectSection(context, page, config, properties) {
    page.Controls[0].Sections.push(GetItemSearchAndSelectSection(context, config, properties));
}

function addItemSection(context, page, config, properties) {
    let columns = GetEDTColumns(config);
    let items = GetEDTItems();
    properties.columns = columns;
    properties.items = items;
    
    page.Controls[0].Sections.push(GetItemTitleDescriptionSection(context, config, properties));
    page.Controls[0].Sections.push(GetItemEDTSection(config, properties));
}

function addSections(context, page, items) {
    let config = GetConfigurations(context);
    config.totalItems = items.length;
    if (libCom.getStateVariable(context, 'BulkUpdateItem') === undefined) {
        libCom.setStateVariable(context, 'BulkUpdateItem', config.totalItems);
    }
    libCom.setStateVariable(context, 'BulkUpdateTotalItems', config.totalItems);
    addItemSearchAndSelectSection(context, page, config);
    
    for (const item of items) {
        addItemSection(context, page, config, item.properties);
    }
}

/**
 * Returns the configurations for extensions (select all, header, EDT) for the given device.
 * 
 * Following dimensions have been tested across various devices iPhone, iPad, android phone, android tablet.
 * These confirgurations work well across all these devices.
 * @param {*} context 
 * @returns 
 */
function GetConfigurations(context) {
    let config = Object();
    config.SelectAllHeight  = SelectAllHeight(context);
    config.ItemHeaderHeight = ItemHeaderHeight(context);
    config.ItemEDTHeight    = EDTHeight(context);
    config.ItemEDTColWidth  = EDTColumnWidth(context); 
    return config;
}

async function GetItems(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const queryTarget = GetOpenItemsTargetQuery(type, context.binding);
    const target = queryTarget.target;
    let query = queryTarget.query + '&$orderby=ItemNum&$expand=MaterialDocItem_Nav,MaterialPlant_Nav';
    const MaterialDocNumber = libCom.getStateVariable(context, 'MaterialDocNumberBulkUpdate');
    const MaterialDocYear = libCom.getStateVariable(context, 'MaterialDocYearBulkUpdate');

    if (type === 'PurchaseOrderHeader') {
        query += ',ScheduleLine_Nav';
    } else if (type === 'StockTransportOrderHeader') {
        query += ',STOScheduleLine_Nav';
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', target, [], query).then(async function(results) {
        let itemArray = [];
        if (!libVal.evalIsEmpty(results)) {
            for (let row of results) {
                const matdocItem = row.MaterialDocItem_Nav.find(rowItem => rowItem.MaterialDocNumber === MaterialDocNumber && rowItem.MaterialDocYear === MaterialDocYear);
                const queryBuilder = new QueryBuilder();
                queryBuilder.addFilter(`MaterialDocNumber eq '${MaterialDocNumber}' and MaterialDocYear eq '${MaterialDocYear}' and MatDocItem eq '${matdocItem.MatDocItem}'`);
                queryBuilder.addExpandStatement('AssociatedMaterialDoc,SerialNum,PurchaseOrderItem_Nav,StockTransportOrderItem_Nav,ReservationItem_Nav,PurchaseOrderItem_Nav/MaterialPlant_Nav,StockTransportOrderItem_Nav/MaterialPlant_Nav,ReservationItem_Nav/MaterialPlant_Nav,StockTransportOrderItem_Nav/StockTransportOrderHeader_Nav,ReservationItem_Nav/ReservationHeader_Nav,PurchaseOrderItem_Nav/PurchaseOrderHeader_Nav,ProductionOrderComponent_Nav/ProductionOrderHeader_Nav,ProductionOrderComponent_Nav/MaterialPlant_Nav,PurchaseOrderItem_Nav/POSerialNumber_Nav,StockTransportOrderItem_Nav/STOSerialNumber_Nav,PurchaseOrderItem_Nav/MaterialDocItem_Nav/SerialNum,StockTransportOrderItem_Nav/MaterialDocItem_Nav/SerialNum');
                
                const description = await GetItemFootnote(context, row);
                const itemDescription = description ? `${row.ItemNum} - ${description}` : row.ItemNum;
                const item = {
                    properties: {
                    Title: await GetItemTextOrMaterialName(context, row),
                    Description: itemDescription,
                    QueryOptions: queryBuilder.build(),
                    },
                };
                itemArray.push(item);
            }  
        }
        return itemArray;
    });
}
