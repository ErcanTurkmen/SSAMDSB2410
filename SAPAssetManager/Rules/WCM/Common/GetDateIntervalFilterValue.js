import ODataDate from '../../Common/Date/ODataDate';
import libCom from '../../Common/Library/CommonLibrary';

export function GetDateIntervalFilterValueDateAndTime(context, dateFilterPropName, timeFilterPropName, visibilitySwitch, startControl, endControl) {
    /** if the visibility switch is on, then return a filtercritera for the validFrom and validTo DATE AND TIME filters and save their control values in clientdata */
    if (visibilitySwitch.getValue() === true) {
        const [start, end] = [startControl, endControl].map(control => {
            let pickerValue = control.getValue();
            return pickerValue ? new Date(pickerValue) : new Date();
        });

        const [oStart, oEnd] = [start, end].map(i => new ODataDate(i));
        const day = dateFilterPropName;
        const time = timeFilterPropName;

        const startDay = `datetime'${oStart.toDBDateString(context)}'`;
        const endDay = `datetime'${oEnd.toDBDateString(context)}'`;
        const startTime = `time'${oStart.toEDMTimeString(context)}'`;
        const endTime = `time'${oEnd.toEDMTimeString(context)}'`;

        let dateFilter = [`(${day} gt ${startDay} or (${day} eq ${startDay} and ${time} ge ${startTime})) and ` +
            `(${day} lt ${endDay} or (${day} eq ${endDay} and ${time} le ${endTime}))`];
        return context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true, visibilitySwitch.getCaption(), [`${context.formatDatetime(start)} - ${context.formatDatetime(end)}`]);
    }
}

export function SetValueInDatePickersFromQueryOptions(context, dateTimeFieldsCfg, filters) {
    Object.entries(dateTimeFieldsCfg).forEach(([field, controls]) => {
        const filterCriteria = filters.find(({ type, filterItems }) => type === 1 && !!filterItems.length && filterItems[0].includes(`${field} eq`));
        if (!filterCriteria) {
            return;
        }
        const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
        const switchControl = fcContainer.getControl(controls.switchControlName);

        const dateTimeQueries = filterCriteria.filterItems[0].split(') and (');
        controls.datePickerControlsNames.forEach((datePickerName, idx) => {
            setDatePicker(context, fcContainer.getControl(datePickerName), dateTimeQueries[idx], switchControl);
        });
    });
}

export function setDatePicker(context, datePickerControl, query, switchControl) {
    const dateMatch = query.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    const timeMatch = query.match(/PT(\d{2})H(\d{2})M(\d{2})S/);

    if (dateMatch && timeMatch) {
        switchControl.setValue(true);
        //Get groups value only
        const groups = timeMatch.slice(1, 4);
        const valueUTC = new Date([`${dateMatch[0].split('T')[0]}`, `${groups.join(':')}Z`].join('T')).getTime() + (-1 * libCom.getBackendOffsetFromSystemProperty(context) * 60 * 60 * 1000);

        const value = new Date(valueUTC);
        datePickerControl.setValue(value);
        datePickerControl.setVisible(true);
    }
}
