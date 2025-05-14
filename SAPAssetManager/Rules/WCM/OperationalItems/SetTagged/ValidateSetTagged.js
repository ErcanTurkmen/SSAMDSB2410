import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import IsLockNumberRequired from './IsLockNumberRequired';
import SetTaggedRequiredFields from './SetTaggedRequiredFields';


export const FieldMaxLengths = Object.freeze({
    LockNumber: 5,
});

export default function ValidateSetTagged(context) {
    const requiredFields = SetTaggedRequiredFields(context);
    return ValidateFields(requiredFields, context);
}

export function ValidateFixLockNumber(context) {
    const requiredFields = IsLockNumberRequired(context) ? ['LockNumber'] : [];
    return ValidateFields(requiredFields, context);
}

function ValidateFields(requiredFields, context) {
    const invalidFields = GetInvalidFields(requiredFields, context);

    invalidFields.forEach(([control, message]) => CommonLibrary.executeInlineControlError(context, control, message));
    return invalidFields.length === 0;
}

function GetInvalidFields(requiredFields, context) {
    // eslint-disable-next-line no-unused-vars
    const name2control = context.getControl('FormCellContainer').getControls().map(c => [c.getName(), c]).filter(([name, _]) => requiredFields.includes(name) || (name in FieldMaxLengths));
    const unfilledRequiredControls = GetUnfilledRequiredFields(name2control, requiredFields, context);
    const maxLengthExceededControls = GetMaxLengthExceededFields(name2control, context);
    return Object.values(Object.assign(maxLengthExceededControls, unfilledRequiredControls)); // [control, error_message:str]
}

function GetMaxLengthExceededFields(name2control, context) {
    /// Object.fromEntries() does not work in Chakra Javascript engine for Windows. Windows MDK recommended Array.from() instead 
    return Array.from(name2control
        .filter(([name, control]) => (name in FieldMaxLengths) && ExceededMaxLength(control, FieldMaxLengths[name]))
        .map(([name, control]) => [name, [control, context.localizeText('exceeds_max_length_x_x', [control.getValue().length, FieldMaxLengths[name]])]])).reduce((acc, [ key, val ]) => Object.assign(acc, { [key]: val }), {});
}

function GetUnfilledRequiredFields(name2control, requiredFields, context) {
    /// Object.fromEntries() does not work in Chakra Javascript engine for Windows. Windows MDK recommended Array.from() instead 
    return Array.from(name2control
        .filter(([name, control]) => requiredFields.includes(name) && IsFieldUnfilled(control))
        .map(([name, control]) => [name, [control, context.localizeText('field_is_required')]])).reduce((acc, [ key, val ]) => Object.assign(acc, { [key]: val }), {});
}

function IsFieldUnfilled(control) {
    return ValidationLibrary.evalIsEmpty(control.getValue());
}

function ExceededMaxLength(control, maxLength) {
    return ValidationLibrary.evalIsEmpty(control.getValue()) ? false : maxLength < control.getValue().length;
}
