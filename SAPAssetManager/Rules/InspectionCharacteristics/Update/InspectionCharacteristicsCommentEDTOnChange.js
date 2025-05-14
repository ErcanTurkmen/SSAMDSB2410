import { MaxCommentLength } from './InspectionCharacteristicsUpdateValidation';

export default function InspectionCharacteristicsCommentEDTOnChange(context) {
    context._control.clearValidation();
    let clientAPI = context._control.getTable().context.clientAPI;
    if (context.getValue().length > MaxCommentLength) {
        context._control.applyValidation(clientAPI.localizeText('maximum_field_length', [MaxCommentLength]));
    }
}
