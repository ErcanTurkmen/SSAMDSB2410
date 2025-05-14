import GetDefaultMovementType from './GetMovementType';
import { CostCenterVisible, GetPOAccountAssignment } from './BulkUpdateLibrary';

export default async function IsCostCenterVisible(context, selectedMovementType = '', poAccountAssignment = '') {
    if (!selectedMovementType) {
        selectedMovementType = await GetDefaultMovementType(context);
    }
    if (!poAccountAssignment) {
        poAccountAssignment = await GetPOAccountAssignment(context);
    }
    return  CostCenterVisibleHelper(selectedMovementType, poAccountAssignment);
}

export function CostCenterVisibleHelper(selectedMovementType, poAccountAssignment) {
    if (CostCenterVisible.MovementType.includes(selectedMovementType))
        return true;
    if (poAccountAssignment)
        return CostCenterVisible.AccountAssignment.includes(poAccountAssignment);
    return false;
}
