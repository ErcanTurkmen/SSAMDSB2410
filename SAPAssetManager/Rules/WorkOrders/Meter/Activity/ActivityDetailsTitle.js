import MeterSectionLibrary from '../../../Meter/Common/MeterSectionLibrary';

/**
* Getting title for ActivityType section in generic way
* Supported on WO, Operations, SubOperation levels
* @param {IClientAPI} clientAPI
*/
export default function ActivityDetailsTitle(clientAPI) {
    const woBinding = MeterSectionLibrary.getWorkOrderBinding(clientAPI);
    return woBinding?.DisconnectActivityType_Nav?.ActivityTypeDescription || '';
}
