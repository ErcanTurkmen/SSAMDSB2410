import { formatKeyValue } from './WorkOrderAddDefenseFlightDetails';

export default function ActualConfig(context) {
    return formatKeyValue(context.binding?.Equipment?.MyEquipOpData_Nav?.Setup);
}
