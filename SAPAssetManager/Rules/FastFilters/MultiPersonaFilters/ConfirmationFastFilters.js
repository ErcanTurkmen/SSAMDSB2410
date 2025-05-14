import FastFilters, { TIME_FILTERS, DUE_DATE_FILTER_GROUP } from '../FastFilters';
import PersonaLibrary from '../../Persona/PersonaLibrary';

export default class ConfirmationFastFilters extends FastFilters {

    constructor(context) {
        const config = {
            dueDatePropertyPath: 'PostingDate',
        };
        const filterPageName = '';
        const listPageName = 'ConfirmationsOverviewListView';
        super(context, filterPageName, listPageName, config);

        this.setNewFilterCaption(TIME_FILTERS.DUE_DATE_TODAY, context.localizeText('today'));
        this.setNewFilterCaption(TIME_FILTERS.DUE_DATE_THIS_WEEK, context.localizeText('this_week_filter'));
        this.setNewFilterCaption(TIME_FILTERS.DUE_DATE_YESTERDAY, context.localizeText('yesterday'));
        this.setNewFilterCaption(TIME_FILTERS.DUE_DATE_LAST_WEEK, context.localizeText('last_week'));
    }

    getFastFilters(context) {
        return [
            { name: TIME_FILTERS.DUE_DATE_YESTERDAY, value: this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_YESTERDAY), group: DUE_DATE_FILTER_GROUP, visible: this.isDueDateFilterVisible(context) },
            { name: TIME_FILTERS.DUE_DATE_LAST_WEEK, value: this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_LAST_WEEK), group: DUE_DATE_FILTER_GROUP, visible: this.isDueDateFilterVisible(context) },
            { name: TIME_FILTERS.DUE_DATE_TODAY, value: this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_TODAY), group: DUE_DATE_FILTER_GROUP, visible: this.isDueDateFilterVisible(context) },
            { name: TIME_FILTERS.DUE_DATE_THIS_WEEK, value: this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_THIS_WEEK), group: DUE_DATE_FILTER_GROUP, visible: this.isDueDateFilterVisible(context) },
        ];
    }

    isDueDateFilterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context);
    }
}
