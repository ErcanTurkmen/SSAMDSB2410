import CommonLibrary from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export default function SubEquipmentListViewQueryOptions(context) {
    let filter;
    let searchString = context.searchString;
    if (searchString) {
        filter = getSearchQuery(context, searchString);
    }
   
    let odataType = context.getPageProxy().binding['@odata.type'];
    if (odataType === '#sap_mobile.MyFunctionalLocation') {
        let query = '$expand=ObjectStatus_Nav/SystemStatus_Nav,EquipDocuments,EquipDocuments/Document';
        if (filter) {
            query += '&$filter=' + filter;
        }
        return query;
    } else if (odataType === '#sap_mobile.MyEquipment') {
        let equipId = context.getPageProxy().binding.EquipId;
        let query = `$filter=SuperiorEquip eq '${equipId}'`;
        if (filter) {
            query += ' and ' + filter;
        }
        return `${query}&$expand=ObjectStatus_Nav/SystemStatus_Nav,EquipDocuments,EquipDocuments/Document`;
    }
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['EquipDesc', 'WorkCenter_Main_Nav/PlantId', 'WorkCenter_Main_Nav/WorkCenterDescr', 'EquipId', 'WorkCenter_Main_Nav/WorkCenterName',
            'WorkCenter_Main_Nav/ExternalWorkCenterId', 'TechnicalID'];
        ModifyListViewSearchCriteria(context, 'MyEquipment', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
