import FastFiltersWithStatuses, { STATUS_FAST_FILTERS, STATUS_FILTER_GROUP } from '../FastFiltersWithStatuses';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { FAST_FILTERS, TIME_FILTERS } from '../FastFilters';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import Logger from '../../Log/Logger';
import isFSMCSKPINewVisible from '../../ServiceOrders/IsFSMCSKPIVisible';
import IsFSMCSSectionVisible from '../../ServiceOrders/IsFSMCSSectionVisible';

const ASSIGNMENT_TYPE_1 = '1';
const ASSIGNMENT_TYPE_2 = '2';
const ASSIGNMENT_TYPE_4 = '4';
const ASSIGNMENT_TYPE_5 = '5';
const ASSIGNMENT_TYPE_6 = '6';
const ASSIGNMENT_TYPE_7 = '7';
const ASSIGNMENT_TYPE_8 = '8';
const ASSIGNMENT_TYPE_A = 'A';

export default class OperationFastFilters extends FastFiltersWithStatuses {

    constructor(context) {
        const config = {
            statusPropertyPath: 'OperationMobileStatus_Nav/MobileStatus',
            assignmentPropertyPath: 'PersonNum',
            emergencyPropertyPath: 'WOHeader/OrderProcessingContext',
            dueDatePropertyPath: 'WOHeader/DueDate',
            modifiedFilterQuery: '',
            confirmedFilterQuery: '',
        };
        const filterPageName = 'WorkOrderOperationsFilterPage';
        const listPageName = 'WorkOrderOperationsListViewPage';

        super(context, filterPageName, listPageName, config);
    }

    getFastFilters(context) {
        let defaultFilters = [
            { name: STATUS_FAST_FILTERS.STATUS_CONFIRMED, value: this._getConfirmedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isConfirmedStatusFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_UNCONFIRMED, value: this._getUnconfirmedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isConfirmedStatusFilterVisible(context) },
            (IsFSMCSSectionVisible(context) && PersonaLibrary.isClassicHomeScreenEnabled(context) ?
                { name: STATUS_FAST_FILTERS.STATUS_CS_IN_PROGRESS, value: this._getInProgressCSFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) } :
                { name: STATUS_FAST_FILTERS.STATUS_STARTED, value: this._getStartedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) }),
            { name: STATUS_FAST_FILTERS.STATUS_COMPLETED, value: this._getCompletedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: TIME_FILTERS.DUE_DATE_TODAY, value: this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_TODAY), visible: this.isDueDateFilterVisible(context) },
            { name: FAST_FILTERS.ASSIGNED_TO_ME, value: this._getAssignmentFilterItemReturnValue(), property: this.config.assignmentPropertyPath, visible: this.isAssignmentFilterVisible(context) },
            { name: FAST_FILTERS.EMERGENCY, value: this._getEmergencyFilterItemReturnValue(), property: this.config.emergencyPropertyPath, visible: this.isEmergencyFilterVisible(context) },
            { name: FAST_FILTERS.MODIFIED, value: this._getPendingFilterItemReturnValue(), visible: this.isModifiedFilterVisible(context) },
        ];
        if (isFSMCSKPINewVisible(context)) {
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
            if (previousPageClientData.OPERATIONS_FAST_FILTER_SHORT_LIST) {
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

    isStatusFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = false;

        if (PersonaLibrary.isMaintenanceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_2 || woAssignmentType === ASSIGNMENT_TYPE_6 || 
                woAssignmentType === ASSIGNMENT_TYPE_A || woAssignmentType === ASSIGNMENT_TYPE_4;
        }
        if (PersonaLibrary.isFieldServiceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_6 
                || woAssignmentType === ASSIGNMENT_TYPE_2 || woAssignmentType === ASSIGNMENT_TYPE_8;
        }

        return isFilterVisible;
    }

    isConfirmedStatusFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = false;

        if (PersonaLibrary.isMaintenanceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_8 || 
                woAssignmentType === ASSIGNMENT_TYPE_5 || woAssignmentType === ASSIGNMENT_TYPE_7;
        }

        return isFilterVisible;
    }

    isAssignmentFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_6 || woAssignmentType === ASSIGNMENT_TYPE_4;
        return isFilterVisible && PersonaLibrary.isMaintenanceTechnician(context);
    }

    isDueDateFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = false;

        if (PersonaLibrary.isMaintenanceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_8 ||
                woAssignmentType === ASSIGNMENT_TYPE_5 || woAssignmentType === ASSIGNMENT_TYPE_7 || woAssignmentType === ASSIGNMENT_TYPE_4;
        }
        if (PersonaLibrary.isFieldServiceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_6
                || woAssignmentType === ASSIGNMENT_TYPE_2 || woAssignmentType === ASSIGNMENT_TYPE_8;
        }

        return isFilterVisible;
    }

    isEmergencyFilterVisible(context) {
        let isValidPersona = PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isFieldServiceTechnician(context);
        return IsPhaseModelEnabled(context) && isValidPersona;
    }

    getFastFilterValuesFromFilterPage(context, mobileStatusesResult = []) {
        let filterResults = super.getFastFilterValuesFromFilterPage(context, mobileStatusesResult);

        if (this.isEmergencyFilterVisible(context)) {
            let clientData = this.getClientData(context);
            if (clientData.EmergencyFiltering) {
                filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, this.config.emergencyPropertyPath, context.localizeText('emergency_work'), [this._getEmergencyFilterItemReturnValue()], false));
                clientData.EmergencyFiltering = false;
            }
        }

        return filterResults;
    }

    _getAssignmentFilterItemReturnValue() {
        const DEFAULT_PERSONAL_NUMBER = '00000000';
        return CommonLibrary.getPersonnelNumber() || DEFAULT_PERSONAL_NUMBER;
    }

    _getPendingFilterItemReturnValue() {
        return this.config.modifiedFilterQuery ? this.config.modifiedFilterQuery + ' or sap.hasPendingChanges()' : 'sap.hasPendingChanges()';
    }

    isModifiedFilterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context) || isFSMCSKPINewVisible(context);
    }
}
