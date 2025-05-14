import IsNewLayoutEnabled from '../../Common/IsNewLayoutEnabled';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary } from '../../WorkOrders/WorkOrderLibrary';
import FSMOverviewOnPageReturning from '../FSMOverviewOnPageReturning';

/**
* List of funtions for FSM overview date selection funstionality
*/

export const FSMSegementedLanguageKeys = Object.freeze({
    today: 'today',
    thisWeek: 'this_week_filter',
    thisMonth: 'this_month_filter',
    customOpen: 'custom_filter_open',
    customShow: 'custom_filter_show',
});

export default class {
    /** 
     * Update selected Segmented mode in app settings
     * @param {ISectionedTableProxy} context
     * @returns {FSMSegementedLanguageKeys | undefined}
     */
    static getFSMSegmentedSavedValue(context) {
        return ApplicationSettings.getString(context, 'CurrentWorkView');
    }

    /** 
     * Update selected Custom date in app settings
     * Resetting custom date if selected mode isn't corresponds to the requirements
     * @param {ISectionedTableProxy} context
     * @returns {Date | undefined}
     */
    static getFSMSegmentedSavedCustomDate(context) {
        const selectedVal = this.getFSMSegmentedSavedValue(context);
        if (selectedVal === FSMSegementedLanguageKeys.customShow) {
            const dateString = ApplicationSettings.getString(context, 'CurrentCustomDate');
            return new Date(dateString);
        } else {
            ApplicationSettings.remove(context, 'CurrentCustomDate');
            return undefined;
        }
    }

    /** 
     * Update selected segmented value in app settings
     * Resetting custom date on update
     * @param {ISectionedTableProxy} context
     * @param {FSMSegementedLanguageKeys} selectedValue
     */
    static setFSMSegmentedSavedValue(context, selectedValue) {
        ApplicationSettings.remove(context, 'CurrentWorkView');
        // resetting CurrentCustomDate on each change of segmented value
        ApplicationSettings.remove(context, 'CurrentCustomDate');
        ApplicationSettings.setString(context, 'CurrentWorkView', selectedValue);
    }

    /** 
     * Update custom date value in app settings
     * @param {ISectionedTableProxy} context
     * @param {Date | undefined} customDate
     */
    static setFSMSegmentedSavedCustomDate(context, customDate) {
        ApplicationSettings.setString(context, 'CurrentCustomDate', customDate.toString());
    }

    /** 
     * Returns default default array of i18n values for available filters
     * @returns {Array<FSMSegementedLanguageKeys>}
     */
    static _getFSMSegmentedValues(withCustomFilter = true) {
        const segmentedValues = [
            FSMSegementedLanguageKeys.today,
            FSMSegementedLanguageKeys.thisWeek,
            FSMSegementedLanguageKeys.thisMonth,
        ];
        if (withCustomFilter) {
            segmentedValues.push(FSMSegementedLanguageKeys.customOpen);
        }
        return segmentedValues;
    }

    /** 
     * Returns default selected value for overview filter and selected layuot
     * @param {ISectionedTableProxy} context 
     * @returns {FSMSegementedLanguageKeys}
     */
    static defaultPeriodValue(context) {
        const savedVal = this.getFSMSegmentedSavedValue(context);
        if (IsNewLayoutEnabled(context) && savedVal) {
            return savedVal;
        }
        return FSMSegementedLanguageKeys.today;
    }

    /** 
     * Returns formatted options for segmented control
     * @param {ISectionedTableProxy} context
     * @returns {Array<{ReturnValue: string, DisplayValue: string}>}
     */
    static availableSegmentedValuesOverview(context) {
        return this._getFSMSegmentedValues().map(item => ({
            DisplayValue: context.localizeText(item),
            ReturnValue: item,
        }));
    }

    /** 
     * Returns string label based on selected value and bounds
     * @param {ISectionedTableProxy} context
     * @param {FSMSegementedLanguageKeys} selectedValue
     * @param {{lowerBound: Date, upperBound: Date}} bounds
     * @returns {String}
     */
    static segmentedCurrentValCaption(context, selectedValue, bounds) {
        const { lowerBound, upperBound } = bounds;

        switch (selectedValue) {
            case FSMSegementedLanguageKeys.today:
            case FSMSegementedLanguageKeys.customOpen:
                // lowerBound equals to upperBound, so we can use only one value
                return context.formatDate(lowerBound);
            case FSMSegementedLanguageKeys.customShow:
                // none is the seconds state of custom date
                return context.localizeText('custom_date_x', [context.formatDate(lowerBound)]);
            case FSMSegementedLanguageKeys.thisWeek:
            case FSMSegementedLanguageKeys.thisMonth:
                return `${context.formatDate(lowerBound)} - ${context.formatDate(upperBound)}`;
            default:
                break;
        }
        return '';
    }

    /** 
     * Reaction to segmented value changes
     * @param {ISectionedTableProxy} context
     */
    static onChangeSegmentedValue(context) {
        const selectedValue = context.getValue()[0].ReturnValue;
        const bounds = this.getBoundsFromSelectedValue(context, selectedValue);
        // updating app settings with latest saved value
        this.setFSMSegmentedSavedValue(context, selectedValue);
        // updating state and refreshing the page
        return this.updateDateRangeVariable(context, bounds, selectedValue);
    }

    /** 
     * Setting date range bounds and updating state variable and page
     * @param {ISectionedTableProxy} context
     * @param {{lowerBound: Date, upperBound: Date} | undefined} bounds
     * @param {FSMSegementedLanguageKeys | Srting | undefined} selectedValue
     */
    static updateDateRangeVariable(context, bounds, selectedValue = FSMSegementedLanguageKeys.customOpen) {
        if (bounds && selectedValue.length) {
            const { lowerBound, upperBound } = bounds;
            const datesBetween = this.getDatesRangeArrayDayInterval(lowerBound, upperBound);
            // updating variable
            // if using single date - lowerBound must be equal to upperBound!
            libCom.setStateVariable(context, 'ActualDates', {
                lowerBound,
                upperBound,
            });
            const promises = datesBetween.map((date) => libCom.createOverviewRow(context, date));
            context.showActivityIndicator();
            return Promise.all(promises).finally(() => {
                context.dismissActivityIndicator();
                context.currentPage.redraw();

                const sectionedTable = context.getPageProxy().getControls()[0];
                // making datepicker visible if custom option is enabled
                const datePickerSection = sectionedTable.getSection('CalendarSection');
                if (datePickerSection) {
                    datePickerSection.setVisible(selectedValue === FSMSegementedLanguageKeys.customOpen);
                }
                // redraw caption for new screen segmented
                const segmentedSection = sectionedTable.getSection('PeriodFilterSection');
                if (segmentedSection) {
                    segmentedSection
                        .getControl('PeriodFilterSectionSegmented')
                        .setCaption(this.segmentedCurrentValCaption(context, selectedValue, bounds));
                }

                // Refresh the map view
                FSMOverviewOnPageReturning(context.getPageProxy());
                return Promise.resolve();
            });
        }
        return false;
    }

    /** 
     * Return bounds based on FSMSegementedLanguageKeys type selection
     * @param {ISectionedTableProxy} context
     * @param {FSMSegementedLanguageKeys} selectedValue
     * @returns {{lowerBound: Date, upperBound: Date} | undefined}
     */
    static getBoundsFromSelectedValue(context, selectedValue, defaultDate = new Date()) {
        const currentDateBounds = WorkOrderLibrary.getBoundsFromDate(defaultDate);
        // lower bound is equal to upper, so no sense what to take here
        const currentDate = currentDateBounds.lowerBound;
        // First day of week is Monday, last day is Sunday
        const firstDayOfWeek = currentDate.getDate() - currentDate.getDay() + 1;
        const lastDayOfWeek = firstDayOfWeek + 6;
        const selectedCustomDate = this.getFSMSegmentedSavedCustomDate(context);

        let bounds;
        switch (selectedValue) {
            // setting today date for custom - as far as we supporting only single day select
            case FSMSegementedLanguageKeys.customOpen:
            case FSMSegementedLanguageKeys.today:
                bounds = currentDateBounds;
                break;
            case FSMSegementedLanguageKeys.thisWeek:
                bounds = {
                    lowerBound: new Date(currentDate.setDate(firstDayOfWeek)),
                    upperBound: new Date(currentDate.setDate(lastDayOfWeek)), 
                };
                break;
            case FSMSegementedLanguageKeys.thisMonth:
                bounds = {
                    lowerBound: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                    upperBound: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), 
                };
                break;
            case FSMSegementedLanguageKeys.customShow:
                bounds = selectedCustomDate
                    ? WorkOrderLibrary.getBoundsFromDate(selectedCustomDate)
                    : currentDateBounds;
                break;
            default:
                break;
        }
        return bounds;
    }

    /** 
     * Get array of dates between target interval
     * @param {Date} startDate
     * @param {Date} endDate
     * @returns {Array<Date>}
     */
    static getDatesRangeArrayDayInterval(startDate, endDate) {
        const dayInterval = 1000 * 60 * 60 * 24; // 1 day
        const duration = endDate - startDate;
        const steps = duration / dayInterval;
        return Array.from(
            { length: steps + 1 },
            // eslint-disable-next-line no-unused-vars
            (_, index) => new Date(startDate.valueOf() + (dayInterval * index)),
        );
    }
}
