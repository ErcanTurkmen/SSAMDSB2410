import libCom from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import MyWorkSectionFilterQuery from '../../OverviewPage/MyWorkSection/MyWorkSectionFilterQuery';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';

export default async function WorkOrderOperationsListViewDefaultFilters(context) {
    let filters = [];
    const { COMPLETED, STARTED, HOLD, REVIEW, DISAPPROVED, APPROVED, RECEIVED, ACCEPTED, ONSITE, TRAVEL } = libMobile.getMobileStatusValueConstants(context);
    
    if (libCom.getStateVariable(context, 'KPI-InProgress')) {
        libCom.removeStateVariable(context, 'KPI-InProgress');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Started', undefined, [`(OperationMobileStatus_Nav/MobileStatus eq '${STARTED}' or OperationMobileStatus_Nav/MobileStatus eq '${HOLD}')`], true));
    }
    if (libCom.getStateVariable(context, 'KPI-Open')) {
        libCom.removeStateVariable(context, 'KPI-Open');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Open', undefined, [`(OperationMobileStatus_Nav/MobileStatus ne '${STARTED}' and OperationMobileStatus_Nav/MobileStatus ne '${HOLD}' and OperationMobileStatus_Nav/MobileStatus ne '${COMPLETED}')`], true, undefined, [context.localizeText('open')]));
    }
    if (libCom.getStateVariable(context, 'KPI-Completed')) {
        libCom.removeStateVariable(context, 'KPI-Completed');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Completed', undefined, [`OperationMobileStatus_Nav/MobileStatus eq '${COMPLETED}'`], true));
    }
    if (libCom.getStateVariable(context, 'KPI-Recieved')) {
        libCom.removeStateVariable(context, 'KPI-Recieved');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'OperationMobileStatus_Nav/MobileStatus', undefined, [RECEIVED], false, undefined, [context.localizeText('received')]));
    }
    if (libCom.getStateVariable(context, 'KPI-NotStarted')) {
        libCom.removeStateVariable(context, 'KPI-NotStarted');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'OperationMobileStatus_Nav/MobileStatus', undefined, [ACCEPTED], false, undefined, [context.localizeText('accepted')]));
    }
    if (libCom.getStateVariable(context, 'KPI-OpenCS')) {
        libCom.removeStateVariable(context, 'KPI-OpenCS');
        const dateFilter = libCom.getStateVariable(context, 'OPERATIONS_DATE_FILTER');
        libCom.setStateVariable(context, 'WORKORDER_FILTER', `$filter=${dateFilter}`);
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Open', undefined, [`(OperationMobileStatus_Nav/MobileStatus eq '${RECEIVED}' or OperationMobileStatus_Nav/MobileStatus eq '${ACCEPTED}') and ${dateFilter}`], true, undefined, [context.localizeText('open')]));
    }
    if (libCom.getStateVariable(context, 'KPI-InProgressCS')) {
        libCom.removeStateVariable(context, 'KPI-InProgressCS');
        const dateFilter = libCom.getStateVariable(context, 'OPERATIONS_DATE_FILTER');
        libCom.setStateVariable(context, 'WORKORDER_FILTER', `$filter=${dateFilter}`);
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'InProgress', undefined, [`(OperationMobileStatus_Nav/MobileStatus eq '${STARTED}' or OperationMobileStatus_Nav/MobileStatus eq '${HOLD}' or OperationMobileStatus_Nav/MobileStatus eq '${TRAVEL}' or OperationMobileStatus_Nav/MobileStatus eq '${ONSITE}') and ${dateFilter}`], true, undefined, [context.localizeText('in_progress')]));
    }
    if (libCom.getStateVariable(context, 'KPI-CompletedCS')) {
        libCom.removeStateVariable(context, 'KPI-CompletedCS');
        const dateFilter = libCom.getStateVariable(context, 'OPERATIONS_DATE_FILTER');
        libCom.setStateVariable(context, 'WORKORDER_FILTER', `$filter=${dateFilter}`);
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Completed', undefined, [`OperationMobileStatus_Nav/MobileStatus eq '${COMPLETED}' and ${dateFilter}`], true, undefined, [context.localizeText('completed')]));
    }

    let myOperationListView = libCom.getStateVariable(context, 'MyOperationListView');
    if (myOperationListView === true) {
        const myWorkFilter = await MyWorkSectionFilterQuery(context, '');
        const filterDisplayValue = `${context.localizeText('assigned_to_me')} / ${context.localizeText('started')}`;
        return [context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [myWorkFilter], true, context.localizeText('my_work'), [filterDisplayValue])];
    }
    if ((SupervisorLibrary.isSupervisorFeatureEnabled(context)) && context.binding && libCom.isDefined(context.binding.isSupervisorOperationsList)) { 
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'OperationMobileStatus_Nav/MobileStatus', undefined, [REVIEW, DISAPPROVED, APPROVED], false, undefined, [context.localizeText(REVIEW), context.localizeText(DISAPPROVED), context.localizeText(APPROVED)]));
    }
   
    filters.push(context.createFilterCriteria(context.filterTypeEnum.Sorter, undefined, undefined, ['SchedEarliestStartDate desc,SchedEarliestStartTime desc'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('scheduled_earliest_start_date')]));
    return filters;
}
