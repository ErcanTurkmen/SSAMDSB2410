import queryOptions from './WorkOrderOperationsListViewQueryOption';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import IsOperationLevelAssigmentType from './IsOperationLevelAssigmentType';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import WorkOrderOperationsListGetTypesQueryOption from './WorkOrderOperationsListGetTypesQueryOption';
import { OperationLibrary } from './WorkOrderOperationLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import MyWorkSectionFilterQuery from '../../OverviewPage/MyWorkSection/MyWorkSectionFilterQuery';
import OnlineWorkOrderOperationsCount from './OnlineWorkOrderOperationsCount';

export default function WorkOrderOperationListViewSetCaption(context, sectionContext) {

    let entitySet;
    let queryOption = '';
    let totalQueryOption = '';
    let localizeText;
    let localizeText_x_x;
    let parameters = CommonLibrary.getStateVariable(context,'OPERATIONS_FILTER');
    
    let quickFilters = decodeURIComponent(CommonLibrary.getQueryOptionFromFilter(context) || '');
    if (quickFilters && parameters?.query) {
        parameters.query = '';
    }

    return WorkOrderOperationsListGetTypesQueryOption(context).then(async typesQueryOptions => {
        if (!libVal.evalIsEmpty(parameters)) {
            entitySet = parameters.entity;
            queryOption = parameters.query;
            localizeText = parameters.localizeTextX;
            localizeText_x_x = parameters.localizeTextXX;
        } else {
            localizeText = 'operations_x';
            localizeText_x_x = 'operations_x_x';
            if (CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding['@odata.type']) && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                entitySet = context.binding['@odata.readLink'] + '/Operations';
                queryOption = queryOptions(sectionContext || context);
            } else {
                entitySet = 'MyWorkOrderOperations';
                if ((libSuper.isSupervisorFeatureEnabled(context)) && CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding.isSupervisorOperationsList)) {
                    queryOption = libSuper.getFilterForOperationPendingReview(context, false);
                } else if ((libSuper.isSupervisorFeatureEnabled(context)) && CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding.isTechnicianOperationsList)) {
                    queryOption = libSuper.getFilterForSubmittedOperation(context, false);
                } else if (IsOperationLevelAssigmentType(context)) {
                    queryOption = CommonLibrary.getQueryOptionFromFilter(context);
                } else if (CommonLibrary.getWorkOrderAssignmentType(context) === '3' && CommonLibrary.isDefined(context.binding) && context.binding['@odata.type'] !== '#sap_mobile.WorkOrderHeader') {
                    entitySet = 'MyWorkOrderSubOperations';
                    queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
                    localizeText = 'suboperations_x';
                    localizeText_x_x = 'suboperations_x_x';
                }
            }
        }

        let additionalFilter = '';

        if (libPersona.isFieldServiceTechnician(context) && !libVal.evalIsEmpty(typesQueryOptions)) {
            additionalFilter = typesQueryOptions;
        }

        if (quickFilters) {
            if (!libVal.evalIsEmpty(parameters)) {
                queryOption = quickFilters;
            }
            if (queryOption) {
                if (queryOption.filter) {
                    queryOption.filter(quickFilters.replace('$filter=',''));
                } else if (queryOption.includes('$filter=')) {
                    queryOption += ' and ' + quickFilters.replace('$filter=','');
                } else {
                    queryOption += '&' + quickFilters;
                }
            } else {
                queryOption = quickFilters;
            }
        } else {
            CommonLibrary.removeStateVariable(context,'OPERATIONS_FILTER');
        }

        const countFilter = OperationLibrary.getOperationsFilterByAssgnTypeOrWCM(context);

        if (countFilter) {
            additionalFilter = additionalFilter ? `${additionalFilter} and ${countFilter}` : countFilter;
        }

        let dateFilterFromFSMOverviewScreen = CommonLibrary.getStateVariable(context, 'OPERATIONS_DATE_FILTER');
        if (dateFilterFromFSMOverviewScreen !== undefined) {
            additionalFilter = additionalFilter ? `${additionalFilter} and ${dateFilterFromFSMOverviewScreen}` : dateFilterFromFSMOverviewScreen;
        }

        if (additionalFilter) {
            totalQueryOption = '$filter=' + additionalFilter;

            if (queryOption && queryOption.filter) {
                queryOption.filter(additionalFilter);
            } else {
                let queryOptionSplitted = queryOption && queryOption.length ? queryOption.split('&') : [];
                let filterIndex = queryOptionSplitted.findIndex(el => el.includes('$filter='));

                if (filterIndex !== -1) {
                    queryOptionSplitted[filterIndex] += ' and ' + additionalFilter;
                } else {
                    queryOptionSplitted.push('$filter=' + additionalFilter);
                }

                queryOption = queryOptionSplitted.join('&');
            }
        }

        if (CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding['@odata.type']) && context.binding['@odata.type'] === '#sap_mobile.InspectionLot') {
            let query = `$expand=WOHeader/InspectionLot_Nav,InspectionPoint_Nav&$filter=(OrderId eq '${context.getPageProxy().getBindingObject().OrderId}' and sap.entityexists(InspectionPoint_Nav))`;
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', query).then(count => {
                let caption = context.localizeText('operations_x', [count]);
                return context.setCaption(caption);
            });
        }

        if (context.getPageProxy().getControl('SectionedTable') && context.getPageProxy().getControl('SectionedTable').getSections()[0].getSelectionMode() === 'Multiple') {
            const COMPLETE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
            const HOLD = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
            const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            const REVIEW = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());

            let query = "$filter=Confirmations/all(wp : wp/FinalConfirmation ne 'X')";

            if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
                query += ' and ' + OperationLibrary.getOperationsFilterByAssignmentType(context);
                query += `and OperationMobileStatus_Nav/MobileStatus ne '${COMPLETE}' and OperationMobileStatus_Nav/MobileStatus ne '${REVIEW}'`;
                let unassignedFilter = "PersonNum eq '00000000' or PersonNum eq '' or PersonNum eq null";
                const persNum = CommonLibrary.getPersonnelNumber();
                const workedByMe = `((OperationMobileStatus_Nav/MobileStatus eq '${STARTED}' or OperationMobileStatus_Nav/MobileStatus eq '${HOLD}') and OperationMobileStatus_Nav/CreateUserGUID eq '${CommonLibrary.getUserGuid(context)}')`;
                if (persNum) {
                    query += ` and (${unassignedFilter} or PersonNum eq '${persNum}' or WOHeader/WOPartners/any(wp : wp/PersonNum eq '${persNum}') or ${workedByMe})`;
                } else {
                    query += ` and (${unassignedFilter} or ${workedByMe})`;
                }
            }

            if (quickFilters) {
                query += ' and ' + quickFilters.replace('$filter=', '');
            }

            let selectedOperations = CommonLibrary.getStateVariable(context, 'selectedOperations') || [];
            return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, query).then(count => {
                let caption;
                if (count > 0) {
                    CommonLibrary.setStateVariable(context, 'OperationsToSelectCount', count);
                    caption = context.localizeText('select_operations_x_x', [selectedOperations.length, count]);
                } else {
                    caption = context.localizeText('operations');
                }
                return context.setCaption(caption);
            });
        }

        let myOperationListView = CommonLibrary.getStateVariable(context, 'MyOperationListView');
        if (myOperationListView === true) {
            queryOption = await MyWorkSectionFilterQuery(context);
        }

        const params = [];
        let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, totalQueryOption);

        if (queryOption && queryOption.build) {
            queryOption = await queryOption.build();
        }
        let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, queryOption);

        return Promise.all([totalCountPromise, countPromise]).then(async function(resultsArray) {
            let totalCount = resultsArray[0];
            let count = resultsArray[1];
            let caption;
            params.push(count);
            params.push(totalCount);
            if (count === totalCount) {
                if (context?.binding?.['@odata.type'] === '#sap_mobile.WorkOrderHeader') {
                    const countCriteria = await OnlineWorkOrderOperationsCount(context);
                    caption = context.localizeText(localizeText, [countCriteria]);
                } else {
                    caption = context.localizeText(localizeText, [totalCount]);
                }
            } else {
                caption = context.localizeText(localizeText_x_x, params);
            }
            context.getClientData().PageCaption = caption;
            return context.setCaption(caption);
        });
    });
}
