import FastFiltersWithStatuses, { STATUS_FAST_FILTERS, STATUS_FILTER_GROUP } from '../FastFiltersWithStatuses';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { FAST_FILTERS, TIME_FILTERS } from '../FastFilters';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import FastFiltersHelper from '../FastFiltersHelper';
import Logger from '../../Log/Logger';
import IsFSMCSKPIVisible from '../../ServiceOrders/IsFSMCSKPIVisible';
import libCom from '../../Common/Library/CommonLibrary';

const ASSIGNMENT_TYPE_1 = '1';
const ASSIGNMENT_TYPE_2 = '2';
const ASSIGNMENT_TYPE_5 = '5';
const ASSIGNMENT_TYPE_6 = '6';
const ASSIGNMENT_TYPE_7 = '7';
const ASSIGNMENT_TYPE_8 = '8';

export default class WOFastFilters extends FastFiltersWithStatuses {

    constructor(context) {
        const config = {
            statusPropertyPath: 'OrderMobileStatus_Nav/MobileStatus',
            emergencyPropertyPath: 'OrderProcessingContext',
            dueDatePropertyPath: 'DueDate',
            modifiedFilterQuery: '',
        };
        const filterPageName = 'WorkOrderFilterPage';
        const listPageName = 'WorkOrdersListViewPage';
        super(context, filterPageName, listPageName, config);
    }

    getFastFilters(context) {
        let flightFilter = libCom.getStateVariable(context, 'flightOrderTypesFilter');
        let defaultFilters = [
            { name: STATUS_FAST_FILTERS.STATUS_STARTED, value: this._getStartedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_COMPLETED, value: this._getCompletedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: TIME_FILTERS.DUE_DATE_TODAY, value: this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_TODAY), visible: this.isDueDateFilterVisible(context) },
            { name: FAST_FILTERS.ASSIGNED_TO_ME, value: this._getAssignmentFilterItemReturnValue(), visible: this.isAssignmentFilterVisible(context) },
            { name: FAST_FILTERS.EMERGENCY, value: this._getEmergencyFilterItemReturnValue(), property: this.config.emergencyPropertyPath, visible: this.isEmergencyFilterVisible(context) },
            { name: FAST_FILTERS.MODIFIED, value: this._getPendingFilterItemReturnValue(), visible: this.isModifiedFilterVisible(context) },
        ];
        if (!PersonaLibrary.isClassicHomeScreenEnabled(context) && (PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isWCMOperator(context))) { //Add 'Open' filter if new overview is visible
            defaultFilters.push({ name: STATUS_FAST_FILTERS.STATUS_MT_OPEN, value: this._getOpenMTFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) });
        }
        if (flightFilter) { //Defense feature flight orders
            defaultFilters.push({ name: FAST_FILTERS.FLIGHT_ORDERS, value: flightFilter, visible: true });
        }
        if (IsFSMCSKPIVisible(context)) {
            return [
                { name: STATUS_FAST_FILTERS.STATUS_CS_OPEN, value: this._getOpenCSFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
                { name: STATUS_FAST_FILTERS.STATUS_CS_IN_PROGRESS, value: this._getInProgressCSFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
                { name: STATUS_FAST_FILTERS.STATUS_CS_COMPLETED, value: this._getCompletedCSFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
                { name: TIME_FILTERS.DUE_DATE_TODAY, value: this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_TODAY), visible: this.isDueDateFilterVisible(context) },
                { name: FAST_FILTERS.MODIFIED, value: this._getPendingFilterItemReturnValue(), visible: this.isModifiedFilterVisible(context) },
            ];
        }
        try {
            let previousPageClientData = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData() || {};
            if (previousPageClientData.WORKORDER_FAST_FILTER_SHORT_LIST) {
                return [
                    { name: STATUS_FAST_FILTERS.STATUS_STARTED, value: this._getStartedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
                    { name: STATUS_FAST_FILTERS.STATUS_COMPLETED, value: this._getCompletedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
                ];
            }
            return defaultFilters;
        } catch (error) {
            Logger.error('getFastFilters', error);
            return defaultFilters;
        }
    }

    resetClientData(context) {
        super.resetClientData(context);
        let clientData = this.getClientData(context);

        //EMERGENCY
        clientData.OrderProcessingContext = false;
    }

    // sets values from the fast filter to the modal filter page
    setFastFilterValuesToFilterPage(context) {
        let fastFilters = FastFiltersHelper.getAppliedFastFiltersFromContext(context);
        let clientData = this.getClientData(context);

        fastFilters.forEach(filter => {
            filter.filterItems.forEach(filterValue => {
                if (filterValue === this._getEmergencyFilterItemReturnValue() && this.isEmergencyFilterVisible(context)) {
                    clientData.OrderProcessingContext = true;
                }
            });
        });

        super.setFastFilterValuesToFilterPage(context);
    }

    // sets values from the modal filter page to the fast filter
    getFastFilterValuesFromFilterPage(context, mobileStatusesResult, dueDateResult) {
        let filterResults = super.getFastFilterValuesFromFilterPage(context, mobileStatusesResult, dueDateResult);
        let clientData = this.getClientData(context);

        if (this.isEmergencyFilterVisible(context) && clientData.OrderProcessingContext) {
            clientData.OrderProcessingContext = false;
        }

        return filterResults;
    }

    isStatusFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = false;

        if (PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isWCMOperator(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_8 ||
                woAssignmentType === ASSIGNMENT_TYPE_5 || woAssignmentType === ASSIGNMENT_TYPE_7;
        }
        if (PersonaLibrary.isFieldServiceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_6
                || woAssignmentType === ASSIGNMENT_TYPE_2 || woAssignmentType === ASSIGNMENT_TYPE_8;
        }

        return isFilterVisible;
    }

    isDueDateFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = false;

        if (PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isWCMOperator(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_5 ||
                woAssignmentType === ASSIGNMENT_TYPE_7 || woAssignmentType === ASSIGNMENT_TYPE_8;
        }
        if (PersonaLibrary.isFieldServiceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_2
                || woAssignmentType === ASSIGNMENT_TYPE_6 || woAssignmentType === ASSIGNMENT_TYPE_8;
        }

        return isFilterVisible;
    }

    isAssignmentFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_8;
        return isFilterVisible && (PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isWCMOperator(context));
    }

    isEmergencyFilterVisible(context) {
        let isValidPersona = PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isWCMOperator(context) || PersonaLibrary.isFieldServiceTechnician(context);
        return IsPhaseModelEnabled(context) && isValidPersona;
    }

    _getAssignmentFilterItemReturnValue() {
        let personnelNum = CommonLibrary.getPersonnelNumber();
        const PARENT_FUNCTION_TYPE = 'VW';

        if (!personnelNum) {
            return `not sap.entityexists(WOPartners) or WOPartners/all(w: w/PartnerFunction ne '${PARENT_FUNCTION_TYPE}')`;
        }

        return `WOPartners/any(wp : wp/PartnerFunction eq '${PARENT_FUNCTION_TYPE}' and wp/PersonnelNum eq '${personnelNum}')`;
    }

    _getPendingFilterItemReturnValue() {
        return this.config.modifiedFilterQuery ? this.config.modifiedFilterQuery + ' or sap.hasPendingChanges()' : 'sap.hasPendingChanges()';
    }

    isModifiedFilterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isWCMOperator(context) || IsFSMCSKPIVisible(context);
    }
}
