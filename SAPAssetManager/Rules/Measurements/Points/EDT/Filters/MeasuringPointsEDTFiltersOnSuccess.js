import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import EDTHelper from '../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTFiltersOnSuccess(context) {
    let filters = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filters;
    if (Object.keys(filters.active).length) {
        return applyFilters(context, filters.active);
    } else {
        return resetFilters(context);
    }
}


function resetFilters(context) {
    let sections = context.getPageProxy().getControls()[0].getSections();
    for (let section of sections) {
        section.setVisible(true);

        if (section.getExtension() && section.getExtension().constructor && section.getExtension().constructor.name === 'EditableDataTableViewExtension') {
            let extension = section.getExtension();
            if (extension) {
                extension.resetFilter();
            }
        }
    }
    return Promise.resolve();
}

function applyFilters(context, filters) {
    let sections = context.getPageProxy().getControls()[0].getSections();
    let edtSectionIndex = 0;

    for (let index = 0; index < sections.length; index++) {
        let section = sections[index];

        if (section._context.element.definition._data.Class === 'EditableDataTableViewExtension') {
            filterSection(context, section, sections[index - 1], filters, edtSectionIndex);
            edtSectionIndex++;
        }
    }

    return Promise.resolve();
}

export function filterSection(context, edtSection, headerSection, filters, edtSectionIndex) {
    let filterResults = filterEDT(context, edtSection, filters, edtSectionIndex);

    if (edtSection.getVisible() !== filterResults.Visbility) {
        headerSection.setVisible(filterResults.Visbility);
        edtSection.setVisible(filterResults.Visbility);
    }

    if (filterResults.Visbility) {
        let extension = edtSection.getExtension();
        if (extension) {
            extension.resetFilter();

            let filteredRows = filterResults.filteredRows;
            if (filteredRows) {
                extension.applyFilter(filteredRows);
            }
        }
    }
}

function filterEDT(context, section, filters, edtSectionIndex) {
    let sectionRowsBindings = CommonLibrary.getStateVariable(context, 'EDTSectionBindings')[edtSectionIndex] || [];
    let firstRow = sectionRowsBindings[0] ? sectionRowsBindings[0] : {};

    if (filters.equipment && filters.equipment.length) {
        if (!filters.equipment.includes(firstRow.EquipId)) {
            return { 'filteredRows': null, 'Visbility': false };
        }
    }

    if (filters.floc && filters.floc.length) {
        if (!filters.floc.includes(firstRow.FuncLocIdIntern)) {
            return { 'filteredRows': null, 'Visbility': false };
        }
    }

    if (filters.prt) {
        if (!firstRow.WorkOrderTool) {
            return { 'filteredRows': null, 'Visbility': false };
        }
    }            

    if ((filters.statuses && filters.statuses.length) || (filters.operations && filters.operations.length)) {
        let filteredRows = [];
        let extension = section.getExtension();
        let rowBindings = extension?.getRowBindings() || [];
        for (let i = 0; i < rowBindings.length; i++) {
            let rowBinding = rowBindings[i];
            let cachedRowBinding = EDTHelper.getCachedRowBinding(context, edtSectionIndex, rowBinding);
            let latestDoc = EDTHelper.getLatestMeasurementDoc(context, cachedRowBinding);

            if (filters.statuses && filters.statuses.length) {
                if (filters.statuses.includes('Empty')) {
                    if (rowBinding.CodeGroup && (!rowBinding.CharCode || rowBinding.IsCodeSufficient === 'X')) {
                        if (!latestDoc.ValuationCode) {
                            filteredRows.push(i);
                            continue;
                        }
                    } else {
                        if (!latestDoc.ReadingValue) {
                            filteredRows.push(i);
                            continue;
                        }
                    }
                }

                if (filters.statuses.includes('Error')) {
                    let cells = extension ? extension.getRowCells(i) : [];
                    if (cells.some(cell => cell._isError) || latestDoc._error === true) {
                        filteredRows.push(i);
                        continue;
                    }
                }
            }

            if (filters.operations && filters.operations.length) {
                if (filters.operations.includes(latestDoc.OperationObjNum)) {
                    filteredRows.push(i);
                    continue;
                }
            }
        }

        return { 'filteredRows': filteredRows, 'Visbility': true };
    } else {
        return { 'filteredRows': null, 'Visbility': true };
    }
}
