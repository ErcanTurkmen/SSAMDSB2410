import GetDefaultMovementType from './GetMovementType';
import { OrderVisible, GetPOAccountAssignment } from './BulkUpdateLibrary';

export default async function IsOrderVisible(context, selectedMovementType = '', poAccountAssignment = '') {
    if (!selectedMovementType) {
        selectedMovementType = await GetDefaultMovementType(context);
    }
    if (!poAccountAssignment) {
        poAccountAssignment = await GetPOAccountAssignment(context);
    }
    return  OrderVisibleHelper(selectedMovementType, poAccountAssignment);
}

export function OrderVisibleHelper(selectedMovementType, poAccountAssignment) {
    if (OrderVisible.MovementType.includes(selectedMovementType))
        return true;
    if (poAccountAssignment)
        return OrderVisible.AccountAssignment.includes(poAccountAssignment);
    return false;
}
