import { formatKeyValue } from './WorkOrderAddDefenseFlightDetails';

export default function Deviation(context) {
    return formatKeyValue(context.binding?.Flight_Nav?.Deviation_Nav?.Description);
}
