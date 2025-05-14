import GetDefaultMovementType from './GetMovementType';
import { NetworkVisible, GetPOAccountAssignment } from './BulkUpdateLibrary';

export default async function IsNetworkVisible(context, selectedMovementType = '', poAccountAssignment = '') {
    if (!selectedMovementType) {
        selectedMovementType = await GetDefaultMovementType(context);
    }
    if (!poAccountAssignment) {
        poAccountAssignment = await GetPOAccountAssignment(context);
    }
    return  NetworkVisibleHelper(selectedMovementType, poAccountAssignment);
}

export function NetworkVisibleHelper(selectedMovementType, poAccountAssignment) {
    if (NetworkVisible.MovementType.includes(selectedMovementType))
        return true;
    if (poAccountAssignment)
        return NetworkVisible.AccountAssignment.includes(poAccountAssignment);
    return false;
}
