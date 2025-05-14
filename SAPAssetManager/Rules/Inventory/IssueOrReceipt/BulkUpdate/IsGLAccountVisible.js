import GetDefaultMovementType from './GetMovementType';
import { GLAccountVisible, GetPOAccountAssignment } from './BulkUpdateLibrary';

export default async function IsGLAccountVisible(context, selectedMovementType = '', poAccountAssignment = '') {
    if (!selectedMovementType) {
        selectedMovementType = await GetDefaultMovementType(context);
    }
    if (!poAccountAssignment) {
        poAccountAssignment = await GetPOAccountAssignment(context);
    }
    return  GLAccountVisibleHelper(selectedMovementType, poAccountAssignment);
}

function GLAccountVisibleHelper(selectedMovementType, poAccountAssignment) {
    if (GLAccountVisible.MovementType.includes(selectedMovementType))
        return true;
    if (poAccountAssignment)
        return GLAccountVisible.AccountAssignment.includes(poAccountAssignment);
    return false;
}
