import GetDefaultMovementType from './GetMovementType';
import { WBSElementVisible, GetPOAccountAssignment } from './BulkUpdateLibrary';

export default async function IsWBSElementVisible(context, selectedMovementType = '', selectedSpecialStockIndicator = '', poAccountAssignment = '') {
    if (!selectedMovementType) {
        selectedMovementType = await GetDefaultMovementType(context);
    }
    if (!poAccountAssignment) {
        poAccountAssignment = await GetPOAccountAssignment(context);
    }
    return  WBSElementVisibleHelper(selectedMovementType, selectedSpecialStockIndicator, poAccountAssignment);
}

export function WBSElementVisibleHelper(selectedMovementType, selectedSpecialStockIndicator, poAccountAssignment) {
    if (WBSElementVisible.MovementType.includes(selectedMovementType) || WBSElementVisible.SpecialStockInd.includes(selectedSpecialStockIndicator))
        return true;
    if (poAccountAssignment)
        return WBSElementVisible.AccountAssignment.includes(poAccountAssignment);
    return false;
}
