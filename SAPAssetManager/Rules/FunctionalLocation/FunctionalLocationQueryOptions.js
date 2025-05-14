import CommonLibrary from '../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../LCNC/ModifyListViewSearchCriteria';
import FLOCFilterbyType from './FLOCFilterByType';
import FunctionalLocationCaption from './FunctionalLocationCaption';

export default async function FunctionalLocationQueryOptions(context) {
    let binding = context.getPageProxy().binding || {};
    let searchString = context.searchString;
    let filter = FLOCFilterbyType(context);
    let query = '';

    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        if (searchString) {
            let qob = context.dataQueryBuilder();
            qob.expand('WorkOrderHeader,WorkCenter_Main_Nav,MeasuringPoints,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav').select('*,WorkCenter_Main_Nav/*,MeasuringPoints/Point');
            qob.filter(`${filter} and ${getSearchQuery(context, searchString.toLowerCase(), ['FuncLocDesc', 
                'WorkCenter_Main_Nav/PlantId', 'WorkCenter_Main_Nav/WorkCenterDescr', 'FuncLocId', 'WorkCenter_Main_Nav/WorkCenterName', 'WorkCenter_Main_Nav/ExternalWorkCenterId'])}`);
            return qob;
        }
        query = `$expand=WorkOrderHeader,WorkCenter_Main_Nav,MeasuringPoints,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav&$select=*,WorkCenter_Main_Nav/*,MeasuringPoints/Point&$filter=${filter}`;
    }

    if (binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        if (searchString) {
            let qob = context.dataQueryBuilder();
            qob.expand('S4RefObject_Nav/S4ServiceOrder_Nav');
            qob.filter(`${filter} and ${getSearchQuery(context, searchString.toLowerCase(), ['FuncLocDesc', 'FuncLocId'])}`);
            return qob;
        }
        query = `$expand=S4RefObject_Nav/S4ServiceOrder_Nav&$filter=${filter}`;
    }

    if (binding['@odata.type'] === '#sap_mobile.S4ServiceRequest') {
        if (searchString) {
            let qob = context.dataQueryBuilder();
            qob.expand('S4RequestRefObj_Nav/S4ServiceRequest_Nav');
            qob.filter(`${filter} and ${getSearchQuery(context, searchString.toLowerCase(), ['FuncLocDesc', 'FuncLocId'])}`);
            return qob;
        }
        query = `$expand=S4RequestRefObj_Nav/S4ServiceRequest_Nav&$filter=${filter}`;
    }

    if (binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmation') {
        if (searchString) {
            let qob = context.dataQueryBuilder();
            qob.expand('S4ServiceConfirmationRefObj_Nav/S4ServiceConfirmation_Nav');
            qob.filter(`${filter} and ${getSearchQuery(context, searchString.toLowerCase(), ['FuncLocDesc', 'FuncLocId'])}`);
            return qob;
        }
        query = `$expand=S4ServiceConfirmationRefObj_Nav/S4ServiceConfirmation_Nav&$filter=${filter}`;
    }

    if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        if (searchString) {
            let qob = context.dataQueryBuilder();
            qob.expand('S4RefObject_Nav/S4ServiceItem_Nav');
            qob.filter(`${filter} and ${getSearchQuery(context, searchString.toLowerCase(), ['FuncLocDesc', 'FuncLocId'])}`);
            return qob;
        }
        query = `$expand=S4RefObject_Nav/S4ServiceOrder_Nav&$filter=${filter}`;
    }

    if (binding['@odata.type'] === '#sap_mobile.S4ServiceQuotation') {
        if (searchString) {
            let qob = context.dataQueryBuilder();
            qob.expand('S4QuotRefObj_Nav/S4ServiceQuotation_QuotPartner_Nav');
            qob.filter(`${filter} and ${getSearchQuery(context, searchString.toLowerCase(), ['FuncLocDesc', 'FuncLocId'])}`);
            return qob;
        }
        query = `$expand=S4QuotRefObj_Nav/S4ServiceQuotation_QuotPartner_Nav&$filter=${filter}`;
    }
    
    const pageName = CommonLibrary.getPageName(context);
    if (pageName === 'FunctionalLocationListViewPage') {
        context.getPageProxy().setCaption(await FunctionalLocationCaption(context));
    }
    
    if (query) {
        return query;
    }

    if (searchString) {
        let qob = context.dataQueryBuilder();
        qob.expand('SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav,WorkCenter_Main_Nav,MeasuringPoints,FuncLocDocuments/Document').select('*,WorkCenter_Main_Nav/*,MeasuringPoints/Point').orderBy('FuncLocId');
        qob.filter(`${getSearchQuery(context, searchString.toLowerCase(), ['FuncLocDesc', 
            'FuncLocId', 'WorkCenter_Main_Nav/PlantId', 'WorkCenter_Main_Nav/WorkCenterDescr', 'WorkCenter_Main_Nav/WorkCenterName', 'WorkCenter_Main_Nav/ExternalWorkCenterId'])}`);
        return qob;
    } else {
        return '$expand=ObjectStatus_Nav/SystemStatus_Nav,WorkCenter_Main_Nav,MeasuringPoints,FuncLocDocuments/Document,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav&$select=*,ObjectStatus_Nav/SystemStatus_Nav/StatusText,WorkCenter_Main_Nav/*,MeasuringPoints/Point';
    }
}

function getSearchQuery(context, searchString, searchByProperties) {
    let searchQuery = '';

    if (searchString) {
        ModifyListViewSearchCriteria(context, 'MyFunctionalLocation', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
