import FastFiltersWithStatuses, { STATUS_FAST_FILTERS, STATUS_FILTER_GROUP } from '../FastFiltersWithStatuses';
import { TIME_FILTERS, DUE_DATE_FILTER_GROUP } from '../FastFilters';
import PersonaLibrary from '../../Persona/PersonaLibrary';

export default class ChecklistFastFilters extends FastFiltersWithStatuses {

    constructor(context) {
        const config = {
            dueDatePropertyPath: 'InspectionLot_Nav/EndDate',
        };
        const filterPageName = 'InspectionLotFilterPage';
        const listPageName = 'InspectionLotListViewPage';

        super(context, filterPageName, listPageName, config);
    }

    getFastFilters(context) {
        return [
            { name: STATUS_FAST_FILTERS.STATUS_OPEN, value: this._getOpenFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_IN_PROCESS, value: this._getInProcessFilterItemReturnValue(), visible: this.isStatusFilterVisible(context) },
            { name: TIME_FILTERS.DUE_DATE_TODAY, value: this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_TODAY), group: DUE_DATE_FILTER_GROUP, visible: this.isDueDateFilterVisible(context) },
            { name: TIME_FILTERS.DUE_DATE_THIS_WEEK, value: this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_THIS_WEEK), group: DUE_DATE_FILTER_GROUP, visible: this.isDueDateFilterVisible(context) },
        ];
    }

    isStatusFilterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context);
    }

    isDueDateFilterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context);
    }

    _getInProcessFilterItemReturnValue() {
        return 'InspectionChar_Nav/any(item:item/Valuation ne \'\') and InspectionChar_Nav/any(item:item/Valuation eq \'\')';
    }

    _getOpenFilterItemReturnValue() {
        return 'InspectionChar_Nav/all(item:item/Valuation eq \'\')';
    }
}
