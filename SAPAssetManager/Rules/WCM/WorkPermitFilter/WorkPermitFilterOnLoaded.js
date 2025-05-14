import filterOnLoaded from '../../Filter/FilterOnLoaded';
import { SetValueInDatePickersFromQueryOptions } from '../Common/GetDateIntervalFilterValue';
import AssignedToLibrary from '../Common/AssignedToLibrary';

export default async function WorkPermitFilterOnLoaded(context) {
    filterOnLoaded(context);

    const filters = context.getPageProxy().getFilter().getFilters();
    if (!filters) {
        return;
    }

    const dateTimeFieldsCfg = {
        ValidFrom: {
            switchControlName: 'ValidFromFilterVisibleSwitch',
            datePickerControlsNames: ['ValidFromDatePickerStart', 'ValidFromDatePickerEnd'],
        },
        ValidTo: {
            switchControlName: 'ValidToFilterVisibleSwitch',
            datePickerControlsNames: ['ValidToDatePickerStart', 'ValidToDatePickerEnd'],
        },
    };

    SetValueInDatePickersFromQueryOptions(context, dateTimeFieldsCfg, filters);

    const partnersNav = context.getPageProxy().binding.PartnersNavPropName;
    AssignedToLibrary.CollectAssignedToSelectedItemsFromFilterCriteria(context, filters, partnersNav);

    // restore selected items from filter criterias for filters Work and Requirements
    let workReqFilters = [];
    filters.forEach(({ type, filterItems }) => {
        if (type === context.filterTypeEnum.Filter && !!filterItems.length && filterItems[0].includes('WCMRequirements/')) {
            workReqFilters = workReqFilters.concat(filterItems);
        }
    });

    if (workReqFilters.length) {
        const workReqFilterTerms = workReqFilters.map(item => `PropertyName eq '${item.match(/WCMRequirements\/([a-zA-Z]+)\b\ ne ''/)[1]}'`).join(' or ');
        const queryOptions = `$filter=(${workReqFilterTerms})`;
        const result = await context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMWorkReqTexts', ['PropertyName', 'GroupId'], queryOptions);

        const workReqControlsMapping = {
            [context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/Requirements/Work1Id.global').getValue()]: 'WorkType1Filter',
            [context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/Requirements/Work2Id.global').getValue()]: 'WorkType2Filter',
            [context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/Requirements/Requirement1Id.global').getValue()]: 'Requirements1Filter',
            [context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/Requirements/Requirement2Id.global').getValue()]: 'Requirements2Filter',
        };

        const values = result.reduce((acc, current) => {
            const control = workReqControlsMapping[current.GroupId];
            const returnValue = current.PropertyName;
            if (acc[control]) {
                acc[control].push(returnValue);
            } else {
                acc[control] = [returnValue];
            }
            return acc;
        }, {});

        Object.entries(values).forEach(entry => {
            context.getControl('FormCellContainer').getControl(entry[0]).setValue(entry[1]);
        });
    }
}
