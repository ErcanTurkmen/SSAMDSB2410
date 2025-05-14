import inspCharLib from './InspectionCharacteristics';
import filterLibrary from './InspectionCharacteristicsEDTFilterLibrary';
import isAndroid from '../../Common/IsAndroid';
import { InspectionValuationVar} from '../../Common/Library/GlobalInspectionResults';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionCharacteristicsOnExtensionLoadedEDT(context) {
    let extension = context._control;
    let sectionBindings = extension.getRowBindings();
    if (sectionBindings && sectionBindings.length > 0) {
        let calulateChars = [];
        for (let i=0; i < sectionBindings.length; i++) {
            if (inspCharLib.isCalculatedAndQuantitative(sectionBindings[i])) {
                calulateChars.push({
                    'rowIndex': i,
                    'rowBinding': sectionBindings[i],
                });
            }
            validateDependentCharacteristics(extension, sectionBindings[i]);
        }
        extension._props.definition.data.ExtensionProperties.UserData.CalulateChars = calulateChars;
    }
    if (isAndroid(context._control.context.clientAPI)) {
        let index = context._control.getUserData().Index;
        let filter = context._control.context.clientAPI.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filter;
        if (filter && !filterLibrary.isFilterApplied(context._control.context.clientAPI, index)) {
            let filterResult = filterLibrary.filterEDT(filterLibrary.findSection(context._control.context.clientAPI, index), filter);
            filterLibrary.setVisibility(context._control.context.clientAPI, filterResult.Visbility, index);
            let page = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage');
            let count = page.getClientData().Count;
            let filteredCount = page.getClientData().FilteredCount;
            let filteredRows = filterResult.filteredRows;
            count = count + filterResult.Count;
            if (filteredRows && filteredRows.length > 0) {
                filteredCount = filteredCount + filteredRows.length;
                context._control.applyFilter(filteredRows);
            }
            page.getClientData().Count = count;
            page.getClientData().FilteredCount = filteredCount;
            updateCaption(count, filteredCount, page, context);
        }
    }
}

function updateCaption(count, filteredCount, page, context) {
    if (count > 0) {
        if (filteredCount === 0) {
            page.setCaption(context.localizeText('record_results_x', [count]));
        } else {
            page.setCaption(context.localizeText('record_results_x_x', [filteredCount, count]));
        }
    }
}

export function validateDependentCharacteristics(extension, sectionBinding, clearValuesIfDisabled = false) {
    if (sectionBinding.InspCharDependency_Nav && sectionBinding.InspCharDependency_Nav.length > 0) {
        let sectionBindings = extension.getRowBindings();
        let valuations = InspectionValuationVar.getInspectionResultValuations();
        for (const char of sectionBinding.InspCharDependency_Nav) {
            const dependentCharBinding = sectionBindings.find(item => item.InspectionChar === char.DependentInspChar && item.InspectionNode === char.InspectionNode);
            const dependentCharIndex = sectionBindings.findIndex(item => item.InspectionChar === char.DependentInspChar && item.InspectionNode === char.InspectionNode);
            let isQualitative = false;
            let isQuantitative = false;
            let isCalculate = false;
            if (dependentCharBinding) {
                let editable = false;
                let notifEditable = false;
                const characteristics = getCharacteristics(dependentCharBinding, char, sectionBinding);
                isQualitative = characteristics.isQualitative;
                isQuantitative = characteristics.isQuantitative;
                isCalculate = characteristics.isCalculate;
                editable = characteristics.editable;

                let cell = getCell(isQualitative, isQuantitative, isCalculate, extension, dependentCharIndex);
                let valuationCtrl = extension.getRowCellByName(dependentCharIndex, 'Valuation');
                let remarksCtrl = extension.getRowCellByName(dependentCharIndex, 'Remarks');
                if (!editable && clearValuesIfDisabled) {
                    cell.setValue('');
                    valuationCtrl.setValue('');
                    remarksCtrl.setValue('');
                }
                cell.setEditable(editable);
                remarksCtrl.setEditable(editable);
                notifEditable = valuations[valuationCtrl.getValue()] === 'R';
                extension.getRowCellByName(dependentCharIndex, 'Notification').setEditable(notifEditable);
            }
        }
    }
}

function getCharacteristics(dependentCharBinding, char, sectionBinding) {
    const characteristics = {isQualitative: false, isQuantitative: false, isCalculate: false, editable: false};
    if (char.AfterAcceptance === 'X') {
        characteristics.editable = sectionBinding.Valuation === 'A';
    } else if (char.AfterRejection === 'X') {
        characteristics.editable = sectionBinding.Valuation === 'R';
    }
    if (char.AfterAcceptance === 'X' || char.AfterRejection === 'X') {
        if (inspCharLib.isQualitative(dependentCharBinding)) {
            characteristics.isQualitative = true;
        } else if (inspCharLib.isQuantitative(dependentCharBinding)) {
            characteristics.isQuantitative = true;
        } else if (inspCharLib.isCalculatedAndQuantitative(dependentCharBinding)) {
            characteristics.isCalculate = true;
        }
    }

    return characteristics;
}

function getCell(isQualitative, isQuantitative, isCalculate, extension, dependentCharIndex) {
    let cell;
    if (isQualitative) {
        cell = extension.getRowCellByName(dependentCharIndex, 'Qualitative');
    } else if (isQuantitative) {
        cell = extension.getRowCellByName(dependentCharIndex, 'Quantitive');
    } else if (isCalculate) {
        cell = extension.getRowCellByName(dependentCharIndex, 'Calculate');
    }
    return cell;
}
