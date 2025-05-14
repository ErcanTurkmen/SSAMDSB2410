import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import { isAssignment1or2 } from '../../ServiceOrders/ListView/ServiceOrderFastFiltersItems';
import FastFiltersHelper from '../FastFiltersHelper';
import FastFiltersWithStatuses, { STATUS_FAST_FILTERS, STATUS_FILTER_GROUP } from '../FastFiltersWithStatuses';

const S4SERVICEITEM_GROUP = 'S4SERVICEITEM_GROUP';

const S4SERVICEITEM_FAST_FILTERS = Object.freeze({
    ITEM: 'S4SERVICEITEM_FAST_FILTERS_ITEM',
    PART: 'S4SERVICEITEM_FAST_FILTERS_PART',
    EXPENSE: 'S4SERVICEITEM_FAST_FILTERS_EXPENSE',
    ERRORS: 'S4SERVICEITEM_FAST_FILTERS_ERRORS',
});

export class S4ServiceItemFastFilters extends FastFiltersWithStatuses {

    /**
     * @param {{binding: S4ServiceItem} & IClientAPI} context
     * @param {{DisplayValue: string, ReturnValue: string}[]} typePickerItems
     * */
    constructor(context, typePickerItems) {
        const config = {
            statusPropertyPath: 'MobileStatus_Nav/MobileStatus',
            errors_filter_query: '',
        };
        const filterPageName = 'ServiceItemFilterPage';
        const listPageName = 'ServiceItemsListViewPage';
        super(context, filterPageName, listPageName, config);
        this.caption2enum = Object.freeze({
            [context.localizeText('service_item')]: S4SERVICEITEM_FAST_FILTERS.ITEM,
            [context.localizeText('part')]: S4SERVICEITEM_FAST_FILTERS.PART,
            [context.localizeText('expense')]: S4SERVICEITEM_FAST_FILTERS.EXPENSE,
            [context.localizeText('items_with_errors')]: S4SERVICEITEM_FAST_FILTERS.ERRORS,
        });
        Object.entries(this.caption2enum).forEach(([caption, filterId]) => this.setNewFilterCaption(filterId, caption));
        this.typePickerItems = typePickerItems;
    }

    /** @param {{binding: ?import('../../ServiceOrders/Item/GetListItemCaption').ServiceItemsListViewPageClientData} & IPageProxy} context */
    getFastFilters(context) {
        if (!ValidationLibrary.evalIsEmpty(context.binding && context.binding.displayShortFastFilterItemList)) {
            return !isAssignment1or2(context) ? [] : [
                {
                    name: STATUS_FAST_FILTERS.STATUS_STARTED,
                    value: this._getStartedFilterItemReturnValue(),
                    group: STATUS_FILTER_GROUP,
                    visible: this.isStatusFilterVisible(context),
                },
                {
                    name: STATUS_FAST_FILTERS.STATUS_COMPLETED,
                    value: this._getCompletedFilterItemReturnValue(),
                    group: STATUS_FILTER_GROUP,
                    visible: this.isStatusFilterVisible(context),
                },
            ];
        }
        /** @type {import('../FastFilters').fastFilterItem[]} */
        const items = this.typePickerItems.map(item => ({
            name: this.caption2enum[item.DisplayValue],
            value: item.ReturnValue,
            group: S4SERVICEITEM_GROUP,
            visible: true,
        }));
        items.push({
            name: STATUS_FAST_FILTERS.STATUS_COMPLETED,
            value: this._getCompletedFilterItemReturnValue(),
            group: STATUS_FILTER_GROUP,
            visible: this.isStatusFilterVisible(context),
        });
        items.push({
            name: S4SERVICEITEM_FAST_FILTERS.ERRORS,
            value: this._getErrorsFilterItemReturnValue(),
            group: '',
            visible: true,
        });

        return items;
    }

    // eslint-disable-next-line no-unused-vars
    isStatusFilterVisible(context) {
        return isAssignment1or2(context);
    }

    setFastFilterValuesToFilterPage(context) {
        const fastFilters = FastFiltersHelper.getAppliedFastFiltersFromContext(context);
        const filterTerms = fastFilters.flatMap(filter => filter.filterItems);
        const selectedFilterItems = this.typePickerItems.filter(item => filterTerms.includes(item.ReturnValue));  // they are always visible, no need to check that. is unique by default

        let typeListPicker = context.evaluateTargetPath(`#Page:${this.filterPageName}/#Control:TypeLstPicker`);
        const value = typeListPicker.getValue() || {};
        typeListPicker.setValue([...value, ...selectedFilterItems.map(i => i.ReturnValue)]);
        super.setFastFilterValuesToFilterPage(context);
    }

    _getErrorsFilterItemReturnValue() {
        if (this.config.errors_filter_query) {
            return this.config.errors_filter_query;
        }
        return 'false';
    }
}
