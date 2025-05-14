import isDefenseEnabled from './isDefenseEnabled';

/**
 * Handles the query options for the Work Order Details page
 * If defense feature is enabled, additional fields are selected and expanded for flights
 * @param {*} context 
 * @returns 
 */
export default function WorkOrderFlightDetailsQueryOptions(context) {

    let expandFields = '', orderByFields = '', selectFields;

    if (isDefenseEnabled(context)) {
        selectFields = '$select=Flight_Nav/ForceElement_Nav/ObjectId,Flight_Nav/ForceElement_Nav/Name,Flight_Nav/Mission_Nav/Mission,Flight_Nav/Mission_Nav/Description,Flight_Nav/ModelIdCode_Nav/ModelId,Flight_Nav/ModelIdCode_Nav/Description,Flight_Nav/Deviation_Nav/Description,Flight_Nav/DeviationReason_Nav/Description';
        selectFields += ',Flight_Nav/ExternalId,Flight_Nav/TakeoffTime,Flight_Nav/TakeoffDate,Flight_Nav/LandingTime,Flight_Nav/LandingDate,Flight_Nav/LandingSite,Flight_Nav/Destination';
        selectFields += ',Flight_Nav/CallSign,Flight_Nav/Runway,Flight_Nav/ConfigCode,Flight_Nav/LandingSite,Flight_Nav/Destination,Equipment/MyEquipOpData_Nav/Setup,Equipment/EquipId';
        expandFields = '&$expand=Flight_Nav,Flight_Nav/DeviationReason_Nav,Flight_Nav/Deviation_Nav,Flight_Nav/FlightLeg_Nav,Flight_Nav/FlightStatus_Nav,Flight_Nav/Mission_Nav,Flight_Nav/ModelIdCode_Nav,Flight_Nav/ForceElement_Nav,Equipment/MyEquipOpData_Nav';
        orderByFields = '&$orderby=Flight_Nav/TakeoffDate,Flight_Nav/TakeoffTime'; //Sort the flight legs by takeoff date and time
    } else {
        selectFields = '$select=OrderId'; //Defense feature is disabled, so do not read the flight info
    }

    return selectFields + expandFields + orderByFields;
}
