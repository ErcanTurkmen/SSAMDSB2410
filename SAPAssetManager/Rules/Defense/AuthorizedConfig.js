import { formatKeyValue } from './WorkOrderAddDefenseFlightDetails';

export default function AuthorizedConfig(context) {
    return formatKeyValue(context.binding?.Flight_Nav?.ConfigCode);
}
