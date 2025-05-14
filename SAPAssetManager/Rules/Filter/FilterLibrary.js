import ODataDate from '../Common/Date/ODataDate';
import ValidationLibrary from '../Common/Library/ValidationLibrary';

/**
 * @typedef FilterPageBinding
 * @prop {Object.<string, string>} DefaultValues
 */

export default class {

    static getFilterCount(context, excludeFields = []) {
        const controls = this.getFilterControls(context) || [];
        return controls
            .filter(control => control.getType() !== 'Control.Type.FormCell.Sorter' &&
                !excludeFields.includes(control.getName()))
            .reduce((sumCount, control) => sumCount + this.getFilterValueCount(control), 0);
    }

    static setFilterValue(control, value) {
        if (control) {
            control.setValue(value);
        }
    }

    static getFilterValue(control) {
        if (control && control.getType() === 'Control.Type.FormCell.ListPicker') {
            if (control.getValue().length > 0) {
                return control.getValue();
            } else {
                return [];
            }
        } else {
            if (control && control.getValue() && control.getValue().filterItems && control.getValue().filterItems[0]) {
                return control.getValue().filterItems[0];
            }
        }
        return '';
    }

    static getFilterValueCount(control) {
        if (control && control.getValue()) {
            switch (control.getType()) {
                case 'Control.Type.FormCell.ListPicker':
                    return control.getValue().length;
                case 'Control.Type.FormCell.SimpleProperty':
                    return control.getValue().length ? 1 : 0;
                case 'Control.Type.FormCell.Switch':
                    break;
                case 'Control.Type.FormCell.DatePicker':
                    return control.visible ? 1 : 0;
                default:
                    return control.getValue().filterItems.length;
            }
        }
        return 0;
    }

    static getFilterControls(context) {
        let formCellContainer = context.getControl('FormCellContainer');
        if (formCellContainer && formCellContainer.getControls()) {
            return formCellContainer.getControls();
        }
        return '';
    }

    static isDefaultFilter(context) {
        return this.isDefaultControl(this.getFilterControls(context));
    }

    static isDefaultControl(controls) {
        let defaultControl = false;
        if (controls) {
            for (let i = 0; i < controls.length; i++) {
                if (controls[i].getType() !== 'Control.Type.FormCell.Button') {
                    defaultControl = this.getDefaultControl(controls, i);
                }
            }
        }
        return defaultControl;
    }

    static getDefaultControl(controls, index) {
        let defaultControl = false;
        if (index === 0) {
            if (this.getFilterValue(controls[index]) === controls[index].getCollection()[0].ReturnValue) {
                defaultControl = true;
            }
        }
        return defaultControl;
    }

    static setDefaultFilter(context, allEmpty) {
        if (ValidationLibrary.evalIsEmpty(allEmpty)) {
            allEmpty = false;
        }
        if (this.getFilterControls(context)) {
            let controls = this.getFilterControls(context);
            this.setDefaultControl(controls, allEmpty);
        }
    }

    static setDefaultControl(controls, allEmpty) {
        if (controls && controls.length > 0) {
            for (let i = 0; i < controls.length; i++) {
                if (i === 0 && !allEmpty) {
                    this.setFilterValue(controls[i], controls[i].getCollection()[0].ReturnValue);
                } else {
                    this.setFilterValue(controls[i], this.getSpecialControlDefaultValue(controls[i]._control.type));
                }
            }
        }
    }

    /**
     * @param {controlType} controlType
     */
    static getSpecialControlDefaultValue(controlType) {
        let specialControlType = '';
        if (controlType === 'Control.Type.FormCell.ListPicker') {
            specialControlType = [];
        } else if (controlType === 'Control.Type.FormCell.DatePicker') {
            specialControlType = new Date();
        }
        return specialControlType;
    }

    /**
     * @param {IClientAPI} clientAPI
     * @param {MDKPage} page make sure it is not just the proxy
     * @param {ISectionedTableProxy} sectionedTable
     */
    static setFilterActionItemText(clientAPI, page, sectionedTable) {
        const filterCount = this.getFilterCountFromCriterias(sectionedTable && sectionedTable.filters || []);
        const filterButton = page.actionBar?.actionItems.getItems().find(i => i.name === 'FilterButton');
        if (filterButton) {
            filterButton.text = this.getFilterButtonText(clientAPI, filterCount);
        }
    }

    static getFilterButtonText(clientAPI, filterCount) {
        return filterCount > 0 ? clientAPI.localizeText('filter_count', [filterCount]) : clientAPI.localizeText('filter');
    }

    /** @param {FilterCriteria[]} criterias */
    static getFilterCountFromCriterias(criterias) {
        let count = 0;
        try {
            if (criterias) {
                const filteredArray = criterias.filter((/** @type {FilterCriteria} */ f) => f.isFilter() && !ValidationLibrary.evalIsEmpty(f.filterItems));
                return filteredArray.reduce((prevCount, currentValue) => prevCount + currentValue.filterItems.length, count);
            }
            return 0;
        } catch (error) {
            return 0;
        }
    }

    /** @param {IButtonFormCellProxy} context */
    static filterResetToDefaults(context) {
        /** @type FilterPageBinding */
        const binding = context.binding || { DefaultValues: {} };
        const controlNamesWithDefault = !ValidationLibrary.evalIsEmpty(binding.DefaultValues) ? Object.keys(binding.DefaultValues) : [];
        const allowedControlTypes = ['Control.Type.FormCell.Sorter', 'Control.Type.FormCell.Filter', 'Control.Type.FormCell.ListPicker', 'Control.Type.FormCell.Switch'];

        const fcContainer = context.getPageProxy().getControl('FormCellContainer');
        fcContainer.getControls()
            .filter((/** @type {IControlProxy} */ c) => c.getEditable() && !controlNamesWithDefault.includes(c.getName()) && allowedControlTypes.includes(c.getType()))
            .forEach((/** @type {IControlProxy} */ c) => {
                const controlValue = c.getValue();
                let controlNewValue = '';
                if (Array.isArray(controlValue)) {
                    controlNewValue = [];
                } else if (typeof controlValue === 'boolean') {
                    controlNewValue = false;
                }
                c.setValue(controlNewValue);
            });

        Object.entries(binding.DefaultValues || {}).forEach(([controlName, defaultValue]) => fcContainer.getControl(controlName).setValue(defaultValue));
    }

    /**
     * @param {IClientAPI} clientAPI
     * @param {IDatePickerFormCellProxy} startControl
     * @param {IDatePickerFormCellProxy} endControl
     * @param {IFormCellProxy} visibleSwitchControl
     * @returns {undefined | FilterCriteria}  */
    static getDateIntervalFilterCriteria(clientAPI, startControl, endControl, visibleSwitchControl, dateFilterPropName) {
        if (visibleSwitchControl.getValue() !== true) {
            return undefined;
        }
        const [ostart, oend] = [startControl, endControl].map(c => this.GetOdataDateFromDatePicker(c));

        let dateFilter = [this.getDateFilterItemReturnValue(dateFilterPropName, ostart.toDBDateString(clientAPI), oend.toDBDateString(clientAPI))];
        return clientAPI.createFilterCriteria(clientAPI.filterTypeEnum.Filter, undefined, undefined, dateFilter, true, visibleSwitchControl.getCaption(), [`${clientAPI.formatDatetime(ostart.date())} - ${clientAPI.formatDatetime(oend.date())}`]);
    }

    /** @param {IDatePickerFormCellProxy} c  */
    static GetOdataDateFromDatePicker(c) {
        const pickerValue = c.getValue();
        const date = pickerValue ? new Date(pickerValue) : new Date();
        if (c.getMode() === 'Date') {
            date.setHours(0, 0, 0, 0);
        }
        return new ODataDate(date);
    }

    /**
     * returns a filterTerm for the date property, the interval is specified by the start and end dates. the end date is excluded (lt), in case the property has time part in addition to date
     * @param {string} startDate odataDate dbDateString
     * @param {string} endDate odataDate dbDateString
     * @returns {string}
     */
    static getDateFilterItemReturnValue(dateProp, startDate, endDate) {
        return `${dateProp} ge datetime'${startDate}' and ${dateProp} lt datetime'${endDate}'`;
    }

    /**
     * @param {Object<string, { switchControlName: string, datePickerControlsNames: [string, string]}>} dateTimeFieldsCfg
     * @param {FilterCriteria[]} filters  */
    static SetValueInDatePickersFromQueryOptions(context, dateTimeFieldsCfg, filters, fcContainer) {
        Object.entries(dateTimeFieldsCfg).forEach(([field, controls]) => {
            const filterCriteria = filters.find(({ type, filterItems }) => type === 1 && !!filterItems.length && filterItems[0].includes(`${field} ge datetime`));
            if (!filterCriteria) {
                return;
            }
            const switchControl = fcContainer.getControl(controls.switchControlName);

            const dateTimeQueries = filterCriteria.filterItems[0].split(' and ');
            controls.datePickerControlsNames.forEach((datePickerName, idx) => {
                this.setDatePicker(fcContainer.getControl(datePickerName), ODataDate.fromDBDateString(context, dateTimeQueries[idx]), switchControl);
            });
        });
    }

    static setDatePicker(datePickerControl, odataDate, switchControl) {
        if (!odataDate) {
            return;
        }
        switchControl.setValue(true);
        datePickerControl.setValue(odataDate.date());
        datePickerControl.setVisible(true);
    }

    /**
     *  @param {string} queryOptionString
     *  @returns {string} filterterm taken out from the input string or inputstring if "$filter" is not found in it
     *  @example
     *  // returns 'that'
     *  TakeFilterTerm('$expand=this&$filter=that&$top=1')
     *  @example
     *  // returns "something eq 'stuff' and Asd gt '0'"
     *  TakeFilterTerm("something eq 'stuff' and Asd gt '0'") */
    static TakeFilterTerm(queryOptionString) {
        const filterPattern = new RegExp(/(\$filter=.+)(&)|(\$filter=.+)/, 'i');
        if (queryOptionString?.includes('$filter=')) {
            const [, filterWithApmersand, , filterWithoutAmpersandAfter] = RegExp(filterPattern).exec(queryOptionString);
            const takenTerm = filterWithoutAmpersandAfter || filterWithApmersand;
            return takenTerm.replace('$filter=', '');
        }
        return queryOptionString;
    }
}
