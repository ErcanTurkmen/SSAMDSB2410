import { formatKeyValue } from './WorkOrderAddDefenseFlightDetails';

export default function Model(context) {
    return formatKeyValue(context.binding.Flight_Nav?.ModelIdCode_Nav?.ModelId, context.binding.Flight_Nav?.ModelIdCode_Nav?.Description);
}
