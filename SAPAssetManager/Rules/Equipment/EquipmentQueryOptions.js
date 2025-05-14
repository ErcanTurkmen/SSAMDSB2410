import Logger from '../Log/Logger';
import CommonLibrary from '../Common/Library/CommonLibrary';
import { setEquipmentCaptionWithCount, combineQueries } from './OnEquipmentFilterSuccess';
import ModifyListViewSearchCriteria from '../LCNC/ModifyListViewSearchCriteria';
import EquipmentFilterbyType from './EquipmentFilterByType';

/**
 * Query options for the MyEquipments entityset shown on the equipment list view page.
 * @param context The PageProxy object.
 */
export default async function EquipmentQueryOptions(context, isFromFilterPage) {
    Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), 'OData read called');

    let binding = context.binding;
    let query = '';
    let filter = EquipmentFilterbyType(context);

    if (binding && binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue()) {
        query = `$expand=WorkCenter_Main_Nav,MeasuringPoints&$select=*,WorkCenter_Main_Nav/*,MeasuringPoints/Point&$orderby=EquipId&$filter=EquipId eq '${context.getPageProxy().binding.HeaderEquipment}'`;
    }
    if (binding && binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue()) {
        query = `$expand=MeasuringPoints,ObjectStatus_Nav/SystemStatus_Nav&$select=*,MeasuringPoints/Point&$filter=${filter}`;
    }
    if (binding && binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue()) {
        query = `$expand=S4RefObject_Nav/S4ServiceOrder_Nav&$filter=${filter}`;
    }
    if (binding && binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceRequest.global').getValue()) {
        query = `$expand=S4RequestRefObj_Nav/S4ServiceRequest_Nav&$filter=${filter}`;
    }
    if (binding && binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceConfirmation.global').getValue()) {
        query = `$expand=S4ServiceConfirmationRefObj_Nav/S4ServiceConfirmation_Nav&$filter=${filter}`;
    }
    if (binding && binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceItem.global').getValue()) {
        query = `$expand=S4RefObject_Nav/S4ServiceOrder_Nav&$filter=${filter}`;
    }
    if (binding && binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceQuotation.global').getValue()) {
        query = `$expand=S4QuotRefObj_Nav/S4ServiceQuotation_QuotPartner_Nav&$filter=${filter}`;
    }

    let queryOption = CommonLibrary.getQueryOptionFromFilter(context);
    if (!isFromFilterPage) {
        queryOption = combineQueries(queryOption, filter);
        await setEquipmentCaptionWithCount(context.getPageProxy(), 'MyEquipments', queryOption);
    }

    if (query) {
        return query;
    }

    let searchString = context.searchString;
    if (searchString) {
        let qob = context.dataQueryBuilder();
        qob.expand('MeasuringPoints,ObjectStatus_Nav/SystemStatus_Nav,EquipDocuments,EquipDocuments/Document,WorkOrderHeader,WorkCenter_Main_Nav').orderBy('EquipId').select('*,ObjectStatus_Nav/SystemStatus_Nav/StatusText,WorkOrderHeader/OrderId,EquipDesc,EquipId,PlanningPlant,MaintPlant,WorkCenter,TechnicalID');
        qob.filter(getSearchQuery(context, searchString.toLowerCase()));
        return qob;
    } else {
        return '$select=*,MeasuringPoints/Point,ObjectStatus_Nav/SystemStatus_Nav/StatusText,WorkOrderHeader/OrderId' +
            '&$orderby=EquipId' +
            '&$expand=MeasuringPoints,ObjectStatus_Nav/SystemStatus_Nav,EquipDocuments,EquipDocuments/Document,WorkOrderHeader,WorkCenter_Main_Nav';
    }
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['EquipDesc', 'WorkCenter_Main_Nav/PlantId', 'WorkCenter_Main_Nav/WorkCenterDescr', 'EquipId', 'WorkCenter_Main_Nav/WorkCenterName',
            'WorkCenter_Main_Nav/ExternalWorkCenterId', 'TechnicalID'];
        ModifyListViewSearchCriteria(context, 'MyEquipment', searchByProperties);
        
        let customSearchQueries = [`substringof('${searchString.toLowerCase()}', tolower(concat(concat(EquipDesc,' - '),MaintPlant)))`];

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties, customSearchQueries);
    }

    return searchQuery;
}
