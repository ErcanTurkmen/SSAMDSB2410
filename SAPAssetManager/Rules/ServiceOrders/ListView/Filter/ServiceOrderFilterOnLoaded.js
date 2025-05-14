import FilterLibrary from '../../../Filter/FilterLibrary';
import FilterOnLoaded from '../../../Filter/FilterOnLoaded';

export default function ServiceOrderFilterOnLoaded(context) {
    FilterOnLoaded(context); //Run the default filter on loaded
    /** @type {import('../ServiceOrderFastFiltersItems').SOListPageClientData} */
    const clientData = context.evaluateTargetPath('#Page:ServiceOrdersListViewPage/#ClientData');
    clientData.SOFastFilters.setFastFilterValuesToFilterPage(context);

    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');

    if (clientData && clientData.predefinedStatus) {
        fcContainer.getControl('MobileStatusFilter').setValue(clientData.predefinedStatus);
        clientData.predefinedStatus = '';
    }

    const filters = context.getPageProxy().getFilter().getFilters();
    if (!filters) {
        return;
    }
    const dateTimeFieldsCfg = {
        RequestedStart: {
            switchControlName: 'RequestStartDateSwitch',
            datePickerControlsNames: ['ReqStartDateFilter', 'ReqEndDateFilter'],
        },
        DueBy: {
            switchControlName: 'DueDateSwitch',
            datePickerControlsNames: ['DueStartDateFilter', 'DueEndDateFilter'],
        },
    };
    FilterLibrary.SetValueInDatePickersFromQueryOptions(context, dateTimeFieldsCfg, filters, fcContainer);
}
