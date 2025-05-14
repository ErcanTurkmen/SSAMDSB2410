import { OperationConstants as Constants, OperationLibrary } from './WorkOrderOperationLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import phaseModelExpand from '../../PhaseModel/PhaseModelListViewQueryOptionExpand';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import OperationsEntitySet from './OperationsEntitySet';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export default function WorkOrderOperationsListViewQueryOption(context) {
    let filter = '';
    let queryBuilder;
    let searchString = context.searchString;
    let clockedInString = context.localizeText('clocked_in');
    let meterQueryOptions = 'UserTimeEntry_Nav,WOHeader/DisconnectActivity_Nav,WOHeader/OrderISULinks/Device_Nav/RegisterGroup_Nav,WOHeader/OrderISULinks/Device_Nav/DeviceCategory_Nav,WOHeader/OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,WOHeader/OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,WOHeader/OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,WOHeader/OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav';

    if (context.dataQueryBuilder) {
        queryBuilder = context.dataQueryBuilder();

        if ((searchString) && (searchString.toLowerCase() === clockedInString.toLowerCase())) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserTimeEntries', ['PreferenceGroup','OrderId','OperationNo','WOHeader_Nav/ObjectKey','WOOperation_Nav/ObjectKey'], '$orderby=PreferenceValue desc&$top=1&$expand=WOHeader_Nav,WOOperation_Nav').then(function(results) {
                if (results && results.length > 0) {
                    let row = results.getItem(0);
                    if (row.PreferenceGroup === 'CLOCK_IN') {
                        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                            queryBuilder.expand(meterQueryOptions);
                        } else {
                            queryBuilder.expand('WOHeader');
                        }
                        let expands = 'WOObjectList_Nav,Tools,OperationMobileStatus_Nav/OverallStatusCfg_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,Employee_Nav,WOOprDocuments_Nav/Document';
                        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
                            expands = 'InspectionPoint_Nav,' + expands;
                        }
                        queryBuilder.expand(expands);
                        queryBuilder.filter(`OrderId eq '${row.OrderId}' and OperationNo eq '${row.OperationNo}'`);
                        return queryBuilder;
                    }
                    return queryBuilder('');
                }
                return queryBuilder('');
            }).catch(() => {
                return queryBuilder(''); //Read failure so return a blank string
            });
        }

        if (searchString) {
            filter = getSearchQuery(context, searchString.toLowerCase());
        }
        if (CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding['@odata.type']) && context.binding['@odata.type'] === '#sap_mobile.InspectionLot') {
            let expand = 'WOHeader/InspectionLot_Nav,WOObjectList_Nav,Tools,OperationMobileStatus_Nav/OverallStatusCfg_Nav,OperationLongText,WOHeader,WOHeader/OrderMobileStatus_Nav,WOHeader/UserTimeEntry_Nav,UserTimeEntry_Nav,WOHeader/WOPriority,Employee_Nav';
            if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
                expand = 'InspectionPoint_Nav,' + expand;
            }
            queryBuilder.expand(expand);
            queryBuilder.filter("(OrderId eq '" + context.getPageProxy().getBindingObject().OrderId + "' and sap.entityexists(InspectionPoint_Nav))");
            queryBuilder.orderBy('OperationNo,OrderId,ObjectKey,OperationMobileStatus_Nav/MobileStatus');
            if (filter) {
                queryBuilder.filter().and(filter);
            }
            return queryBuilder;
        } else if (CommonLibrary.getStateVariable(context, 'FromOperationsList')) { // if we are coming from the side menu
            queryBuilder = Constants.FromWOrkOrderOperationListQueryOptions(context);
        } else if ((libSuper.isSupervisorFeatureEnabled(context)) && CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding.isSupervisorOperationsList)) {
            queryBuilder = libSuper.getFilterForOperationPendingReview(context);
        } else if ((libSuper.isSupervisorFeatureEnabled(context)) && CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding.isTechnicianOperationsList)) {
            queryBuilder = libSuper.getFilterForSubmittedOperation(context);
        }

        let filterByAssignmentType;
        // apply filter by assignment type only for MyWorkOrderOperations entity set
        if (OperationsEntitySet(context) === 'MyWorkOrderOperations') {
            filterByAssignmentType = OperationLibrary.getOperationsFilterByAssignmentType(context);
        }

        if (queryBuilder) {
            queryBuilder.expand('OperationMobileStatus_Nav/OverallStatusCfg_Nav,Confirmations,Employee_Nav');
            queryBuilder.expand('WOHeader/OrderMobileStatus_Nav'); //Required for operation status changes
            queryBuilder.expand('WOOprDocuments_Nav/Document');
            queryBuilder.orderBy('OrderId,OperationNo,ObjectKey,OperationMobileStatus_Nav/MobileStatus');

            if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
                queryBuilder.expand('InspectionPoint_Nav');
            }

            if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                queryBuilder.expand(meterQueryOptions);
            } else {
                queryBuilder.expand('WOHeader,OperationMobileStatus_Nav/OverallStatusCfg_Nav,UserTimeEntry_Nav');
            }
            if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue()) && CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding['@odata.type']) && context.binding['@odata.type'] === '#sap_mobile.InspectionLot') {
                queryBuilder.expand('WOHeader/InspectionLot_Nav,WOObjectList_Nav,Tools,OperationMobileStatus_Nav/OverallStatusCfg_Nav,OperationLongText,WOHeader,WOHeader/UserTimeEntry_Nav,UserTimeEntry_Nav,WOHeader/WOPriority,Employee_Nav');
                queryBuilder.filter("(OrderId eq '" + context.getPageProxy().getBindingObject().OrderId + "' and sap.entityexists(InspectionPoint_Nav))");
                queryBuilder.orderBy('OperationNo,OrderId,ObjectKey,OperationMobileStatus_Nav/MobileStatus');
                if (filter) {
                    queryBuilder.filter().and(filter);
                }
                return queryBuilder;
            }
            if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue())) {
                queryBuilder.expand('EAMChecklist_Nav');
            }
            if (IsPhaseModelEnabled(context)) {
                queryBuilder.expand(phaseModelExpand('OVG'));
            }
            if (filter) {
                queryBuilder.filter(filter);
            }

            if (filterByAssignmentType) {
                if (queryBuilder.hasFilter) {
                    queryBuilder.filter().and(filterByAssignmentType);
                } else {
                    queryBuilder.filter(filterByAssignmentType);
                }
            }

            const COMPLETE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
            const HOLD = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
            const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            const REVIEW = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
            if (context.getPageProxy().getControl('SectionedTable') && context.getPageProxy().getControl('SectionedTable').getSections()[0].getSelectionMode() === 'Multiple') {

                queryBuilder.filter(Constants.notFinallyConfirmedFilter());

                if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
                    queryBuilder.expand('WOHeader/WOPartners');

                    //Exclude completed ones and the ones in review
                    queryBuilder.filter(`OperationMobileStatus_Nav/MobileStatus ne '${COMPLETE}' and OperationMobileStatus_Nav/MobileStatus ne '${REVIEW}'`);

                    //Include unassigned ones
                    let unassignedFilter = "PersonNum eq '00000000' or PersonNum eq '' or PersonNum eq null";
                    const persNum = CommonLibrary.getPersonnelNumber();
                    const workedByMe = `((OperationMobileStatus_Nav/MobileStatus eq '${STARTED}' or OperationMobileStatus_Nav/MobileStatus eq '${HOLD}') and OperationMobileStatus_Nav/CreateUserGUID eq '${CommonLibrary.getUserGuid(context)}')`;
                    if (persNum) {
                        queryBuilder.filter(`(${unassignedFilter} or PersonNum eq '${persNum}' or WOHeader/WOPartners/any(wp : wp/PersonNum eq '${persNum}') or ${workedByMe})`);
                    } else {
                        queryBuilder.filter(`(${unassignedFilter} or ${workedByMe})`);
                    }
                }

            }

            let dateFilterFromFSMOverviewScreen = CommonLibrary.getStateVariable(context, 'OPERATIONS_DATE_FILTER');
            if (dateFilterFromFSMOverviewScreen !== undefined) {
                if (queryBuilder.hasFilter) {
                    queryBuilder.filter().and(dateFilterFromFSMOverviewScreen);
                } else {
                    queryBuilder.filter(dateFilterFromFSMOverviewScreen);
                }
            }

            return queryBuilder;
        } else {
            let queryOptions = Constants.OperationListQueryOptions(context);

            if (CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding.isInitialFilterNeeded)) { // initial filter for the list of operations for a particular date
                queryOptions += '&' + CommonLibrary.getStateVariable(context,'OPERATIONS_FILTER').query;
            }

            queryOptions = CommonLibrary.attachFilterToQueryOptionsString(queryOptions, filterByAssignmentType);

            return CommonLibrary.attachFilterToQueryOptionsString(queryOptions, filter);
        }
    }
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['OrderId', 'OperationNo', 'OperationShortText'];

        if (libSuper.isSupervisorFeatureEnabled(context)) {
            searchByProperties.push('Employee_Nav/LastName');
            searchByProperties.push('Employee_Nav/FirstName');
        }

        ModifyListViewSearchCriteria(context, 'MyWorkOrderOperation', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
