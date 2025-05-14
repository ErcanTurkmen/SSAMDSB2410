import libCom from '../Common/Library/CommonLibrary';
import ODataDate from '../Common/Date/ODataDate';
import phaseFilterResult from '../PhaseModel/PhaseModelFilterPickerResult';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';
import PhaseLibrary from '../PhaseModel/PhaseLibrary';

export default function WorkOrderListFilterResults(context) {
    let clientData = context.evaluateTargetPath('#Page:WorkOrdersListViewPage/#ClientData');
    let filterResults = GetWorkOrderListFilterCriteria(context, true); 
    const mobileStatusFilter = filterResults.find(c => c.name === 'OrderMobileStatus_Nav/MobileStatus');
    const dueDateFilterIdx = filterResults.findIndex(res => res.isArrayFilterProperty && res.filterItems[0]?.includes('DueDate'));
    const dueDateFilter = dueDateFilterIdx !== -1 ? filterResults.splice(dueDateFilterIdx, 1)[0] : null;

    if (clientData.WOFastFiltersClass) {
        filterResults = filterResults.concat(clientData.WOFastFiltersClass.getFastFilterValuesFromFilterPage(context, mobileStatusFilter.filterItems, dueDateFilter));
    }

    libCom.removeStateVariable(context, 'DATE_FILTER');

    return filterResults;
}

export function GetWorkOrderListFilterCriteria(context, saveToClientData = false) {
    let clientData = context.evaluateTargetPath('#Page:WorkOrdersListViewPage/#ClientData');
    let result1 = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:MobileStatusFilter/#Value');
    let result3 = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:PriorityFilter/#Value');
    let result4 = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:FavoriteFilter/#Value');
    let result5 = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:MyWorkordersFilter/#Value');
    let result6 = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:TypeFilter/#FilterValue');
    let minorSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:EmergencySwitch');
    let filterResults = [result1, result2, result3, result5, result6];

    const assignedToFilter = GetAssignmentFilter(context, saveToClientData);
    filterResults.push(assignedToFilter);

    if (IsPhaseModelEnabled(context)) {
        let phase = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:PhaseFilter/#Value');
        let result = phaseFilterResult(context, 'PhaseFilter', phase);
        if (result) {
            filterResults.push(result);
        }

        PhaseLibrary.addPhaseControlFilterResult(context, 'WorkOrderFilterPage', filterResults);
        PhaseLibrary.addPhaseControlKeyFilterResult(context, 'WorkOrderFilterPage', filterResults);
    }

    const {
        dateFilterResult,
        dateSwitch,
        startDate,
        endDate,
    } = GetDateFilterProps(context, 'RequestStartDateSwitch', 'ReqStartDateFilter', 'ReqEndDateFilter', 'RequestStartDate', context.localizeText('request_start_date')) || {};

    filterResults.push(dateFilterResult);
    if (saveToClientData) {
        clientData.reqDateSwitch = dateSwitch;
        clientData.reqStartDate = startDate;
        clientData.reqEndDate = endDate;
    }

    const {
        dateFilterResult: dueDateFilterResult,
        dateSwitch: dueDateSwitch,
        startDate: dueStartDate,
        endDate: dueEndDate,
    } = GetDateFilterProps(context, 'DueDateSwitch', 'DueStartDateFilter', 'DueEndDateFilter', 'DueDate', context.localizeText('due_date')) || {};

    filterResults.push(dueDateFilterResult);
    if (saveToClientData) {
        clientData.dueDateSwitch = dueDateSwitch;
        clientData.dueStartDate = dueStartDate;
        clientData.dueEndDate = dueEndDate;
    }

    if (result4 && result4.filterItems.length) {
        let filter = context.createFilterCriteria(context.filterTypeEnum.Filter, 'MarkedJob/PreferenceValue', undefined, ['true'], false, '', [context.localizeText('Favorite')]);
        filterResults.push(filter);
    }

    // Emergency Work Switch
    if (minorSwitch.getValue()) {
        filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'OrderProcessingContext', context.localizeText('emergency_work'), [context.localizeText('emergency_work')], false));
    }

    return filterResults.filter(c => !!c);
}

function GetAssignmentFilter(context, saveToClientData = false) {
    const assignments = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:AssignmentFilter/#Value');
    
    if (assignments.length > 0) { //Assignee rows for supervisor selected
        if (saveToClientData) {
            libCom.setStateVariable(context, 'SupervisorAssignmentFilter', assignments); //Save for defaulting on filter page when opened
        }
        let lines = [];
        let selected = [];
        let unassigned = '';
        let filter;

        for (let row of assignments) {
            let target = row.ReturnValue;
            if (target === '00000000') { //Unassigned
                unassigned = "not sap.entityexists(WOPartners) or WOPartners/all(w: w/PartnerFunction ne 'VW')";
            } else {
                lines.push("wp/PersonnelNum eq '" + target + "'");
            }
            selected.push(target);
        }
        if (saveToClientData) {
            libCom.setStateVariable(context, 'SupervisorAssignmentFilter', selected); //Save for defaulting on filter page when opened
        }
        let line2 = "WOPartners/any(wp : wp/PartnerFunction eq 'VW' and (";
        let title;
        //Build the array of people into a single filter statement
        if (lines.length > 0) { //At least 1 person
            filter = [line2 + lines.join(' or ') + '))'];
            if (unassigned) {
                filter = ['(' + unassigned + ') or (' + filter[0] + ')']; //Handle unassigned and assigned at same time
            }
            title = assignments.map(assignment => assignment.DisplayValue).join(' / ');
        } else { //Only unassigned
            filter = [unassigned];
            title = context.localizeText('unassigned');
        }
        return context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, title, filter, true, undefined, [title]);
    }
    return null;
}

function GetDateFilterProps(context, switchCtrlName, startCtrlName, endCtrlName, filterProp, fastFilterLabel) {
    let dateSwitch = context.evaluateTargetPath(`#Page:WorkOrderFilterPage/#Control:${switchCtrlName}`);

    if (dateSwitch.getValue() === true) {
        let startDate = libCom.getFieldValue(context, startCtrlName);
        let sdate = (libCom.isDefined(startDate)) ? startDate : new Date();
        sdate.setHours(0,0,0,0);
        let odataStartDate = new ODataDate(sdate);
        let odataBackendStartDate =  odataStartDate.toDBDateString(context);


        let endDate = libCom.getFieldValue(context, endCtrlName);
        let edate = (libCom.isDefined(endDate)) ? endDate : new Date();
        edate.setHours(23,59,59);
        let odataEndDate = new ODataDate(edate);
        let odataBackendEndDate =  odataEndDate.toDBDateString(context);
        odataBackendEndDate = odataBackendEndDate.substring(0,10) + 'T23:59:59';

        let dateFilter = [`${filterProp} ge datetime'${odataBackendStartDate}' and ${filterProp} le datetime'${odataBackendEndDate}'`];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true, fastFilterLabel, [`${context.formatDatetime(sdate)} - ${context.formatDatetime(edate)}`]);

        return {
            dateFilterResult,
            dateSwitch: dateSwitch.getValue(),
            startDate: odataBackendStartDate,
            endDate: odataBackendEndDate,
        };
    }

    return null;
}
