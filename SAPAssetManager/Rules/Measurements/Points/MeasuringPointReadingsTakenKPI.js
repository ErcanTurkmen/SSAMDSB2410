import libCommon from '../../Common/Library/CommonLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';

export default function MeasuringPointReadingsTakenKPI(context) {
    if (!PersonaLibrary.isMaintenanceTechnician(context) && !PersonaLibrary.isFieldServiceTechnician(context)) {
        return '';
    }

    let pageProxy = context.getPageProxy();
    if (libCommon.isDefined(pageProxy.binding)) {
        const binding =  pageProxy.binding;

        if (binding['@sap.isLocal']) {
            return '';
        }

        if (binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue()) {
            return roundsKPIQueryOptions(pageProxy);
        } else {
            return '';
        }
    }
}

function roundsKPIQueryOptions(context) {
    let MeasuringPointData = {};
    let total = 0;

    /* Query options are in the following order:
     * 1. Expand
     *    a. Equipment Measuring Points
     *    b. FLOC Measuring Points
     *
     *    c. Operation Equipment Measuring Points
     *    d. Operation FLOC Measuring Points
     *
     *    e. Sub Operation Equipment Measuring Points
     *    f. Sub Operation FLOC Measuring Points
     *  2. Select
     *    a. Equipment Measuring Points - Point Number
     *    b. FLOC Measuring Points - Point Number
     *
     *    c. Operation Equipment Measuring Points - Point Number
     *    d. Operation FLOC Measuring Points - Point Number
     *
     *    e. Sub Operation Equipment Measuring Points - Point Number
     *    f. Sub Operation FLOC Measuring Points - Point Number
     *
     *    g. Operation ObjectKey
     *    h. Sub-Operation ObjectKey
     *
     *  Equipment/FLOC associated Work Order and Operation is stored on Client Data
     */
    const expand = 'Equipment/MeasuringPoints,FunctionalLocation/MeasuringPoints,Equipment/MeasuringPoints/MeasurementDocs,FunctionalLocation/MeasuringPoints/MeasurementDocs,' + 
    'Operations/EquipmentOperation/MeasuringPoints,Operations/FunctionalLocationOperation/MeasuringPoints,Operations/Tools,' +
    'Operations/NotifHeader_Nav/FunctionalLocation/MeasuringPoints,Operations/NotifHeader_Nav/FunctionalLocation/MeasuringPoints/MeasurementDocs,' +
    'Operations/NotifHeader_Nav/Equipment/MeasuringPoints,Operations/NotifHeader_Nav/Equipment/MeasuringPoints/MeasurementDocs,' +
    'Operations/WOObjectList_Nav/FuncLoc_Nav/MeasuringPoints,Operations/WOObjectList_Nav/FuncLoc_Nav/MeasuringPoints/MeasurementDocs,' +
    'Operations/WOObjectList_Nav/Equipment_Nav/MeasuringPoints,Operations/WOObjectList_Nav/Equipment_Nav/MeasuringPoints/MeasurementDocs,' +
    'Operations/SubOperations/EquipmentSubOperation/MeasuringPoints,Operations/SubOperations/FunctionalLocationSubOperation/MeasuringPoints,' +
    'Operations/EquipmentOperation/MeasuringPoints/MeasurementDocs,'+
    'Operations/FunctionalLocationOperation/MeasuringPoints/MeasurementDocs,Operations/SubOperations/EquipmentSubOperation/MeasuringPoints/MeasurementDocs,'+
    'Operations/SubOperations/FunctionalLocationSubOperation/MeasuringPoints/MeasurementDocs';
    const select = 'Equipment/EquipId,Equipment/MeasuringPoints/Point,FunctionalLocation/FuncLocIdIntern,FunctionalLocation/MeasuringPoints/Point,' + 
    'Operations/EquipmentOperation/MeasuringPoints/Point,Operations/FunctionalLocationOperation/MeasuringPoints/Point,' +
    'Operations/SubOperations/EquipmentSubOperation/MeasuringPoints/Point,Operations/SubOperations/FunctionalLocationSubOperation/MeasuringPoints/Point,' +
    'Operations/ObjectKey,Operations/SubOperations/ObjectKey,Operations/OperationNo,Operations/SubOperations/OperationNo,Operations/OperationShortText,Operations/SubOperations/OperationShortText,Operations/Tools/PRTCategory,' +
    'Operations/SubOperations/SubOperationNo';

    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], `$expand=${expand}&$select=${select}`,
        ).then(function(result) {
            if (result && result.length > 0) {
                let results = result.getItem(0);
                let orderId = context.binding.ObjectKey || context.binding.OrderMobileStatus_Nav.ObjectKey;

                // Top-level Equipment?
                if (results.Equipment) {
                    findReadingsTaken(results.Equipment.MeasuringPoints, orderId, MeasuringPointData);
                }
                // Top-level FLOC?
                if (results.FunctionalLocation) {
                    findReadingsTaken(results.FunctionalLocation.MeasuringPoints, orderId, MeasuringPointData);
                }

                // Operations
                for (let op in results.Operations) {
                    // Operation Equipment?
                    if (results.Operations[op].EquipmentOperation) {
                        findReadingsTaken(results.Operations[op].EquipmentOperation.MeasuringPoints, orderId, MeasuringPointData);
                    }
                    // Operation FLOC?
                    if (results.Operations[op].FunctionalLocationOperation) {
                        findReadingsTaken(results.Operations[op].FunctionalLocationOperation.MeasuringPoints, orderId, MeasuringPointData);
                    }

                    // Operation notification equipment
                    if (results.Operations[op].NotifHeader_Nav && results.Operations[op].NotifHeader_Nav.Equipment) {
                        findReadingsTaken(results.Operations[op].NotifHeader_Nav.Equipment.MeasuringPoints, orderId, MeasuringPointData);
                    }

                    // Operation notification FLOC
                    if (results.Operations[op].NotifHeader_Nav && results.Operations[op].NotifHeader_Nav.FunctionalLocation) {
                        findReadingsTaken(results.Operations[op].NotifHeader_Nav.FunctionalLocation.MeasuringPoints, orderId, MeasuringPointData);
                    }

                    // Operation object list equiment and FLOCs
                    if (results.Operations[op].WOObjectList_Nav && results.Operations[op].WOObjectList_Nav.length > 0) {
                        for (let obj in results.Operations[op].WOObjectList_Nav) {
                            if (results.Operations[op].WOObjectList_Nav[obj].Equipment_Nav) {
                                findReadingsTaken(results.Operations[op].WOObjectList_Nav[obj].Equipment_Nav.MeasuringPoints, orderId, MeasuringPointData);
                            }
                            if (results.Operations[op].WOObjectList_Nav[obj].FuncLoc_Nav) {
                                findReadingsTaken(results.Operations[op].WOObjectList_Nav[obj].FuncLoc_Nav.MeasuringPoints, orderId, MeasuringPointData);
                            }
                        }
                    }

                    // Suboperations
                    for (let sop in results.Operations[op].SubOperations) {
                        // Suboperation Equipment?
                        if (results.Operations[op].SubOperations[sop].EquipmentSubOperation) {
                            findReadingsTaken(results.Operations[op].SubOperations[sop].EquipmentSubOperation.MeasuringPoints, orderId, MeasuringPointData);
                        }
                        // Suboperation FLOC?
                        if (results.Operations[op].SubOperations[sop].FunctionalLocationSubOperation) {
                            if (results.Operations[op].SubOperations[sop].EquipmentSubOperation) {
                                findReadingsTaken(results.Operations[op].SubOperations[sop].FunctionalLocationSubOperation.MeasuringPoints, orderId, MeasuringPointData);
                            }
                        }
                    }
                }
            }
            let readingsTakenCount = 0;
            for (let key in MeasuringPointData) {
                if (MeasuringPointData[key]) {
                    readingsTakenCount++;
                }
            }

            total = Object.keys(MeasuringPointData).length;

            if (total > 0 ) {
                return readingsTakenCount + '/' + total;
            } else {
                return '';
            }
        });
}

function findReadingsTaken(measuringPoints, orderId, mpdict) {
    if (measuringPoints) {
        let found = false;
        for (let measuringPoint of measuringPoints) {
            const docs = measuringPoint.MeasurementDocs;
            for (let doc of docs) {
                if (doc.OrderObjNum === orderId) {
                    found = true;
                    mpdict[measuringPoint.Point] = true;
                    break;
                }
            }
            if (!found) {
                mpdict[measuringPoint.Point] = false;
            } else {
                found = false;
            }
        }
    }
}
