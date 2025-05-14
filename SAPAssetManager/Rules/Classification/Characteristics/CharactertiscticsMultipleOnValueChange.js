import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';

export default function CharactertiscticsMultipleOnValueChange(context) {
    ResetValidationOnInput(context);
    return context.getPageProxy().setActionBarItemVisible(1, true);
}
