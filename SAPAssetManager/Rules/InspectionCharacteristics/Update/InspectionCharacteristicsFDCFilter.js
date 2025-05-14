
import libVal from '../../Common/Library/ValidationLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import {evaluateBooleanExpression} from '../../Common/Library/Evaluate';
import libCom from '../../Common/Library/CommonLibrary';

export default function InspectionCharacteristicsFDCFilter(context) {

    let previousPage = libCom.getStateVariable(context, 'FDCPreviousPage');
    let sectionBindings = context.evaluateTargetPathForAPI('#Page:' + previousPage).getClientData().SectionBindings;
    let equipments = [];
    let funcLocs = [];
    let operations =[];
    const createUpdatePage = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage');
    const createUpdatePageClientData = createUpdatePage.getClientData();

    if (sectionBindings && sectionBindings.length > 0) {
        for (let sectionBinding of sectionBindings) {
            let odataType = sectionBinding['@odata.type'];
            if (odataType === '#sap_mobile.InspectionCharacteristic') {
                let equipId = (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && sectionBinding.EAMChecklist_Nav) ? sectionBinding.EAMChecklist_Nav.Equipment:sectionBinding.InspectionPoint_Nav.EquipNum;
                let funcLoc = (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && sectionBinding.EAMChecklist_Nav) ? sectionBinding.EAMChecklist_Nav.FunctionalLocation: sectionBinding.InspectionPoint_Nav.FuncLocIntern;
                let bindingObject = sectionBinding.EAMChecklist_Nav ? sectionBinding.EAMChecklist_Nav : sectionBinding.InspectionPoint_Nav;

                if (!libVal.evalIsEmpty(equipId) && !equipments.includes(equipId)) {
                    equipments.push(equipId);
                }

                if (!libVal.evalIsEmpty(funcLoc) && !funcLocs.includes(funcLoc)) {
                    funcLocs.push(funcLoc);
                }

                if (!libVal.evalIsEmpty(bindingObject.OperationNo)) {
                    const operationNum = `(OrderId eq '${bindingObject.OrderId}' and OperationNo eq '${bindingObject.OperationNo}')`;
                    if (!operations.includes(operationNum)) {
                        operations.push(operationNum);
                    }
                }
            }
        }
    }
    createUpdatePageClientData.Equipments = equipments;
    createUpdatePageClientData.FuncLocs = funcLocs;
    createUpdatePageClientData.Operations = operations;


    return context.executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsFDCFilterNav.action').then(filterResult => {

        // For each section, determine if filter criteria states it should (not) be displayed
        const sections = createUpdatePage.getControls()[0].sections;
        let sectionsCountWithBinding = sections.length;
        let resultsCount = 0;

        for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex ++) {
            const sectionBinding = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings[sectionIndex];

            // exclude sections without binding (Add attachment, Validate All button)
            if (libVal.evalIsEmpty(sectionBinding)) {
                sectionsCountWithBinding--;
                continue;
            }

            const section = sections[sectionIndex];

            // Truncate $filter= from filter
            let filter = filterResult.data.filter.match(/\$filter=(.*)/)[1];

            let newFilter = filter.replace(/(\w+) eq '([\w-]+)'/g, (expr) => {
                /// Object.fromEntries() does not work in Chakra Javascript engine for Windows. Windows MDK recommended Array.from() instead 
                let obj = Array.from([expr.match(/(\w+) eq '([\w-]+)'/).slice(1, 3)]).reduce((acc, [ key, val ]) => Object.assign(acc, { [key]: val }), {});

                // __Status is a special property that won't be in an OData entity set. Handle this separately
                if (obj.FilterSeg) {
                    switch (obj.FilterSeg) {
                        case 'Empty':
                            // If FilterSeg is "Empty" determine emptiness by the following function
                            if (section.getControl('QuantitativeValue').visible) {
                                return section.getControl('QuantitativeValue').getValue().length === 0;
                            } else if (section.getControl('QualitativeValueSegment').visible) {
                                return !libVal.evalIsEmpty(section.getControl('QualitativeValueSegment').getValue()[0]);
                            } else if (section.getControl('QualitativeValue').visible) {
                                return !libVal.evalIsEmpty(section.getControl('QualitativeValue').getValue()[0]);
                            }
                            return false;
                        case 'Error':
                            // If FilterSeg is "Error" determine if section is in error by checking if any control has its validation view shown
                            return section.getControls().some(control => control._control._validationProperties.ValidationViewIsHidden === undefined ? false : !control._control._validationProperties.ValidationViewIsHidden);
                        default:
                            // Default: show section
                            return true;
                    }
                } else if (obj.Equipment) {
                    let equipId = (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && sectionBinding.EAMChecklist_Nav) ? sectionBinding.EAMChecklist_Nav.Equipment:sectionBinding.InspectionPoint_Nav.EquipNum;
                    return equipId === obj.Equipment;
                } else if (obj.Operations) {
                    let operationNum = (sectionBinding.EAMChecklist_Nav) ? sectionBinding.EAMChecklist_Nav.OperationNo : sectionBinding.InspectionPoint_Nav.OperationNo;
                    return operationNum === obj.Operations;
                } else {
                    // If nothing matches, return false
                    return true;
                }
            });
            // Evaluate newFilter as boolean expression, since all equivalency statements have been evaluated above
        
            if (libVal.evalIsEmpty(newFilter)) {
                newFilter = '(true)';
            }

            const visibleValue = evaluateBooleanExpression(newFilter);

            if (visibleValue) {
                resultsCount = resultsCount + 1;
            }
            section.setVisible(visibleValue);
        }


        createUpdatePage.setCaption(sectionsCountWithBinding === resultsCount ? context.localizeText('record_results_x', [resultsCount]) : context.localizeText('record_results_x_x', [resultsCount, sectionsCountWithBinding]));
        createUpdatePage.getControls()[0].redraw();
    });
}
