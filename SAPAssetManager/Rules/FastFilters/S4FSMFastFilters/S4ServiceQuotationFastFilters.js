import FastFiltersWithStatuses, { STATUS_FAST_FILTERS } from '../FastFiltersWithStatuses';

export class S4ServiceQuotationFastFilters extends FastFiltersWithStatuses {
    constructor(context) {
        const config = {
            statusPropertyPath: 'MobileStatus_Nav/MobileStatus',
        };
        super(context, 'ServiceQuotationsFilterPage', 'ServiceQuotationsListViewPage', config);

        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_STARTED, context.localizeText('started'));
    }

    getFastFilters() {
        return [
            { name: STATUS_FAST_FILTERS.STATUS_RECEIVED, value: this.RECEIVED, property: this.config.statusPropertyPath, visible: this.isStatusFilterVisible() },
            { name: STATUS_FAST_FILTERS.STATUS_STARTED, value: this.STARTED, property: this.config.statusPropertyPath, visible: this.isStatusFilterVisible() },
            { name: STATUS_FAST_FILTERS.STATUS_COMPLETED, value: this.COMPLETED, property: this.config.statusPropertyPath, visible: this.isStatusFilterVisible() },
        ];
    }

    isStatusFilterVisible() {
        return true;
    }

    _getReceivedFilterItemReturnValue() {
        return `(${this.config.statusPropertyPath} eq '${this.RECEIVED}')`;
    }

    _getStartedFilterItemReturnValue() {
        return `(${this.config.statusPropertyPath} eq '${this.STARTED}')`;
    }

    _getCompletedFilterItemReturnValue() {
        return `(${this.config.statusPropertyPath} eq '${this.COMPLETED}')`;
    }
}
