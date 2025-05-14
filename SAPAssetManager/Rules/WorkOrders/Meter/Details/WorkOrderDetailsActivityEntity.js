import MeterSectionLibrary from '../../../Meter/Common/MeterSectionLibrary';

/**
* Getting entity set name based on related WO in generic way
* Supported on WO, Operations, Suboperations
* @param {IClientAPI} clientAPI
*/
export default function WorkOrderDetailsActivityEntity(clientAPI) {
    const woBinding = MeterSectionLibrary.getWorkOrderBinding(clientAPI);
    return `${woBinding['@odata.readLink']}/DisconnectActivity_Nav`;
}
