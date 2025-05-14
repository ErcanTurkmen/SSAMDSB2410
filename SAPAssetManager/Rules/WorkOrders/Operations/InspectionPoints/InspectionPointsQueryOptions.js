import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';
import UserFeaturesLibrary from '../../../UserFeatures/UserFeaturesLibrary';

export default function InspectionPointsQueryOptions(context) {
    let query = '$expand=WOOperation_Nav/WOHeader/OrderMobileStatus_Nav,Equip_Nav,InspValuation_Nav,InspCode_Nav,InspectionChar_Nav,InspectionLot_Nav,FuncLoc_Nav';

    if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue())) {
        query += ',WOOperation_Nav/WOHeader/EAMChecklist_Nav';
    }

    let searchString = context.searchString;
    if (searchString) {
        query += '&$filter=' + getSearchQuery(context, searchString.toLowerCase());
    }

    return query;
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['InspCode_Nav/CodeDesc', 'InspValuation_Nav/ShortText', 'Equip_Nav/EquipDesc', 'Equip_Nav/EquipId', 'FuncLoc_Nav/FuncLocDesc', 'FuncLoc_Nav/FuncLocId', 'InspectionLot_Nav/ShortDesc'];
        ModifyListViewSearchCriteria(context, 'InspectionPoint', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
