import { formatKeyValue } from './WorkOrderAddDefenseFlightDetails';

export default function DeviationReason(context) {
    return formatKeyValue(context.binding?.Flight_Nav?.DeviationReason_Nav?.Description);
}
