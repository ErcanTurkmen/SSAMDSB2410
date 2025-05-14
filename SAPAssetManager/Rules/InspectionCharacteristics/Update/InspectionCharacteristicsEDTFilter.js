import filterLibrary from './InspectionCharacteristicsEDTFilterLibrary';
import InspectionCharacteristicsUpdateWithNoValidationEDT from './InspectionCharacteristicsUpdateWithNoValidationEDT';

export default async function InspectionCharacteristicsEDTFilter(context) {
    
    let filetrData = filterLibrary.getUserData(context).FilterData;
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Equipments = filetrData.Equipments;
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FuncLocs = filetrData.FunctionalLocations;
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Operations = filetrData.Operations;
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FilterApplied = filetrData.FilterApplied;
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Count = 0;
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FilteredCount = 0;
    
    let filter = await context.executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsFDCFilterNav.action').then(async filterResult => {
        return filterResult.data.filter.match(/\$filter=(.*)/)[1];
    }); 
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filter = filter;

    await InspectionCharacteristicsUpdateWithNoValidationEDT(context);
    if (filter === '') {
        await filterLibrary.resetFilter(context);
    } else {
        await filterLibrary.resetFilter(context);
        // workaround for MDKBUG-1671: periodically check if all sections are updated
        const waitForRedraw = new Promise((resolve) => {
            const waitingId = setInterval(() => {
                let sections = context.getPageProxy().getControls()[0].getSections();
                if (isRedrawFinished(sections)) {
                    clearInterval(waitingId);
                    resolve();
                }
            }, 300);
        });
        waitForRedraw.then(() => {
            filterLibrary.filterSections(context, filter);
        });
    }
}

// checks if every section is already set and has access to its extensions and for EDT to its row bindings
function isRedrawFinished(sections) {
    return sections.every(sec => sec.getExtension() &&
        sec.getExtension().getRowBindings ?
        sec.getExtension().getRowBindings()[0] :
        true);
}
