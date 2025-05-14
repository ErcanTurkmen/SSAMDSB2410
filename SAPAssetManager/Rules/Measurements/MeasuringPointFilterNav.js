import {evaluateBooleanExpression} from '../Common/Library/Evaluate';
import PersonaLibrary from '../Persona/PersonaLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

/**
* Run dynamic page filter action and filter sections appropriately
* @param {IClientAPI} clientAPI
*/
export default function MeasuringPointFilterNav(context) {

    /**
     * Helper Function: Determines whether or not a measuring point section is "empty"
     * @param {IClientAPI} section section context
     * @param {Object} sectionBinding Measuring Point section binding
     */
    let sectionPointIsEmpty = function(section, sectionBinding) {
        if (sectionBinding.CodeGroup) { //code group is not empty
            if (!sectionBinding.CharCode || sectionBinding.IsCodeSufficient === 'X') { //Val Code only or Both fields exist and one is required
                return section.getControl('ValuationCodeLstPkr').getValue().length === 0 ? true : false; // Show section if picker is empty
            } else { //Reading only
                return section.getControl('ReadingSim').getValue() ? true : false; // Show section if reading is empty
            }
        } else { //Code group empty means Reading only
            return section.getControl('ReadingSim').getValue() ? false : true; // Show section if reading is empty
        }
    };

    return context.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointFilterNav.action').then(async filterResult => {
        // For each section, determine if filter criteria states it should (not) be displayed
        const sections = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getControls()[0].sections;

        for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex ++) {
            const section = sections[sectionIndex];
            // Truncate $filter= from filter
            let filter = filterResult.data.filter.match(/\$filter=(.*)/)[1];

            // If filter is empty, set section to visible
            if (filter === '') {
                section.setVisible(true);
            } else {

                let operationTechnicalObjectsMapping;
                if (IsS4ServiceIntegrationEnabled(context) && PersonaLibrary.isFieldServiceTechnician(context)) {
                    operationTechnicalObjectsMapping = await context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/ServiceItems_Nav`, [], 
                        '$expand=RefObjects_Nav/FuncLoc_Nav/MeasuringPoints,RefObjects_Nav/Equipment_Nav/MeasuringPoints&$select=ItemNo,RefObjects_Nav/Equipment_Nav/MeasuringPoints/Point,RefObjects_Nav/FuncLoc_Nav/MeasuringPoints/Point')
                    .then(result => result.reduce((result2, element) => {
                        if (!result2[element.ItemNo])
                            result2[element.ItemNo] = [];
    
                        for (let refObject of element.RefObjects_Nav) {
                            if (refObject.Equipment_Nav && refObject.Equipment_Nav.MeasuringPoints) {
                                result2[element.ItemNo] = result2[element.ItemNo].concat(refObject.Equipment_Nav.MeasuringPoints.map(pt => pt.Point));
                            }
                            if (refObject.Equipment_Nav && refObject.Equipment_Nav.MeasuringPoints) {
                                result2[element.ItemNo] = result2[element.ItemNo].concat(refObject.Equipment_Nav.MeasuringPoints.map(pt => pt.Point));
                            }
                        }
                        return result2;
                    }, {}));
                } else if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue()) {
                    operationTechnicalObjectsMapping = await context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Operations`, [], 
                        '$expand=FunctionalLocationOperation/MeasuringPoints,EquipmentOperation/MeasuringPoints&$select=OperationNo,EquipmentOperation/MeasuringPoints/Point,FunctionalLocationOperation/MeasuringPoints/Point')
                    .then(result => result.reduce((result2, element) => {
                        // Create array for Operation if it doesn't exist
                        if (!result2[element.OperationNo])
                            result2[element.OperationNo] = [];

                        // Add Equipment/FLOC points, if present, to Operation
                        if (element.EquipmentOperation) {
                            result2[element.OperationNo] = result2[element.OperationNo].concat(element.EquipmentOperation.MeasuringPoints.map(pt => pt.Point));
                        } else if (element.FunctionalLocationOperation) {
                            result2[element.OperationNo] = result2[element.OperationNo].concat(element.FunctionalLocationOperation.MeasuringPoints.map(pt => pt.Point));
                        }
                        return result2;
                    }, {}));
                }

                // Otherwise, determine whether or not section should be shown
                // Evaluate `field eq 'value'` segments and replace with 'true' or 'false'
                let newFilter = filter.replace(/(\w+) eq '([\w-]+)'/g, (expr) => {
                    // Create an object of key-value pairs, e.g. "(__Status eq 'Error')" ==> {'Status' : 'Error'}
                    /// Object.fromEntries() does not work in Chakra Javascript engine for Windows. Windows MDK recommended Array.from() instead 
                    let obj = Array.from([expr.match(/(\w+) eq '([\w-]+)'/).slice(1, 3)]).reduce((acc, [ key, val ]) => Object.assign(acc, { [key]: val }), {});

                    const sectionBinding = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings[sectionIndex];

                    // __Status is a special property that won't be in an OData entity set. Handle this separately
                    if (obj.__Status) {
                        switch (obj.__Status) {
                            case 'Empty':
                                // If __Status is "Empty" determine emptiness by the following function
                                return `${sectionPointIsEmpty(section, sectionBinding)}`;
                            case 'Error':
                                // If __Status is "Error" determine if section is in error by checking if any control has its validation view shown
                                return section.getControls().some(control => control._control._validationProperties.ValidationViewIsHidden === undefined ? false : !control._control._validationProperties.ValidationViewIsHidden) ? 'true' : 'false';
                            default:
                                // Default: show section
                                return 'true';
                        }
                    } else if (obj.Operation) {
                        return operationTechnicalObjectsMapping[obj.Operation].find(point => point === sectionBinding.Point) ? 'true' : 'false';
                    }  else if (obj.S4Item) {
                        return operationTechnicalObjectsMapping[obj.S4Item].find(point => point === sectionBinding.Point) ? 'true' : 'false';
                    } else if (obj.FilterPRT === 'true') {
                        // Determine if an Operation Number is being used for the filter and if this section binding has a WorkOrderTool whose Operation matches the selected Operation
                        return sectionBinding.WorkOrderTool.length > 0 ? 'true' : 'false';
                    } else if (obj.FunctionalLocation && sectionBinding.FunctionalLocation) {
                        // Determine if a Functional Location is being used for the filter and if this section binding matches the selected Functional Location ID
                        return obj.FunctionalLocation === sectionBinding.FunctionalLocation.FuncLocId ? 'true' : 'false';
                    } else if (obj.Equipment && sectionBinding.Equipment) {
                        // Determine if an Equipment is being used for the filter and if this section binding matches the selected Equipment ID
                        return obj.Equipment === sectionBinding.Equipment.EquipId ? 'true' : 'false';
                    } else {
                        // If nothing matches, return false
                        return 'false';
                    }
                });
                // Evaluate newFilter as boolean expression, since all equivalency statements have been evaluated above
                section.setVisible(evaluateBooleanExpression(newFilter));
            }
        }
        const total_points = context.getControls()[0]._sections.length;
        const filtered_points = context.getControls()[0]._sections.filter(section => section._context.element.visible).length;

        if (total_points !== filtered_points)
            context.setCaption(context.localizeText('take_reading_x_x', [filtered_points, total_points]));
        else
            context.setCaption(context.localizeText('take_readings'));
        context.getPageProxy().getControls()[0].redraw();
    });
}
