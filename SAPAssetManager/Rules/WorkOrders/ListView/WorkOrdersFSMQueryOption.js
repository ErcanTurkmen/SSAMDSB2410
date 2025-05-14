import libPersona from '../../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function WorkOrdersFSMQueryOption(context, filter, excludePhaseTypes=false) {
    const filterValue = filter || libPersona.getActivePersona(context);
    if (filterValue) {
        return getPhaseOrderTypesExcludeObject(context, excludePhaseTypes).then((resultObject) => {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserObjectTypes', [], `$filter=Persona eq '${filterValue}' and Object eq 'ORI'`).then(types => {
                if (types && types.length > 0) {
                    let typesArray = [];
                    types.forEach(function(element) {
                        if (resultObject) {
                            if (!resultObject[element.Type]) {  //Check list of phase types to exclude
                                typesArray.push(`OrderType eq '${element.Type}'`);
                            }
                        } else {
                            typesArray.push(`OrderType eq '${element.Type}'`);
                        }
                    });
                    return `(${typesArray.join(' or ')})`;
                }
                return 'true';
            });
        });
    }
    return Promise.resolve('');
}

/**
 * Get an object with phase types
 * Phase enabled orders cannot be used to add operations from client
 * @param {*} context 
 * @returns 
 */
function getPhaseOrderTypesExcludeObject(context, excludePhaseTypes) {
    if (IsPhaseModelEnabled(context) && excludePhaseTypes) {
        let resultObject = {};
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['OrderType'], "$filter=PhaseModelActive eq 'X'").then(types => {
            if (types && types.length > 0) {
                types.forEach(function(element) {
                    resultObject[element.OrderType] = true;
                });
            }
            return resultObject;
        });
    }
    return Promise.resolve(false);
}
