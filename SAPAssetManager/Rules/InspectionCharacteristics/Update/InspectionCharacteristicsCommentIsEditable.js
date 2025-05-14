import { isRejectionValuation } from './InspectionCharacteristicsUpdateValidation';

export default async function InspectionCharacteristicsCommentIsEditable(control, newValuation) {    
    const isRejection = await isRejectionValuation(control, newValuation || control.binding.Valuation);
    if (control.binding.RemarksRequiredOnRejection === 'X') {
        return isRejection;
    }

    return true;
}
