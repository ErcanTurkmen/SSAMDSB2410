import libThis from './ValidationLibrary';
import LocalizationLibrary from './LocalizationLibrary';
import CommonLibrary from './CommonLibrary';
import Logger from '../../Log/Logger';
export default class {
    /*
     * determines if a value is undefined, empty or null
     */
    static evalIsEmpty(val) {
        return (val === undefined || val == null || val.length <= 0 || val === 'undefined');
    }

    /*
     * determines if a value is not undefined, empty or null
     */
    static evalIsNotEmpty(val) {
        return !this.evalIsEmpty(val);
    }

    /**
    * Checks if the param is a number
    */
    static evalIsNumeric(val) {
        if (libThis.evalIsEmpty(val)) return false;
        return !isNaN(Number(val)) && isFinite(val);
    }

    static evalAreNumbersEqual(context, firstNumber, secondNumber) {
        return LocalizationLibrary.toNumber(context, firstNumber) === LocalizationLibrary.toNumber(context, secondNumber);
    }

    static isFirstNumberGreaterThanSecond(context, firstNumber, secondNumber) {
        return LocalizationLibrary.toNumber(context, firstNumber) > LocalizationLibrary.toNumber(context, secondNumber);
    }

    static isFirstNumberLessThanSecond(context, firstNumber, secondNumber) {
        return LocalizationLibrary.toNumber(context, firstNumber) < LocalizationLibrary.toNumber(context, secondNumber);
    }

    static isControlEmpty(control) {
        return this.evalIsEmpty(control.getValue());
    }

    static isExceededMaxLength(control, maxLength) {
        const value = control.getValue();
        return this.evalIsEmpty(value) ? false : maxLength < value.length;
    }

    /**
    * @param {(IControlProxy & IClientAPI)[]} controls
    * @param {string[]} requiredControlNames
    * @returns {(IControlProxy & IClientAPI)[]}
    */
    static getUnfilledRequiredControls(controls, requiredControlNames) {
        return controls.filter(c => requiredControlNames.includes(c.getName()) && this.isControlEmpty(c));
    }

    /**
    * filters the argument controls array with the predicate that determines if the control's value's length is greater than the one specified on the argument controlNameToMaxLength.
    * controlNameToMaxLength is an object. e.g.: {MyExampleDescriptionFieldName: 13, MyOtherExampleFieldName: 40, ...}
    * @param {(IControlProxy & IClientAPI)[]} controls
    * @param {Object.<string, number>} controlNameToMaxLength
    * @returns {(IControlProxy & IClientAPI)[]}
    */
    static getMaxLengthExceededControls(controls, controlNameToMaxLength) {
        return controls.filter(c => (c.getName() in controlNameToMaxLength) && this.isExceededMaxLength(c, controlNameToMaxLength[c.getName()]));
    }

    /**
    * @param {(IControlProxy & IClientAPI)} control
    * @param {number} maxLength
    */
    static controlSetMaxLengthValidation(control, maxLength) {
        const valueLength = control.getValue().length;
        return maxLength < valueLength ? CommonLibrary.executeInlineControlError(control, control, control.localizeText('exceeds_max_length_x_x', [valueLength, maxLength])) : CommonLibrary.clearValidationOnInput(control);
    }

    /**
    * @param {IClientAPI} context
    * @param {(IControlProxy & IClientAPI)[]} controls
    * @param {string[]} requiredControlNames
    * @param {Object.<string, number>} controlNameToMaxLength
    * @returns {(IControlProxy & IClientAPI)[]}
    */
    static setValidationInlineErrors(context, controls, requiredControlNames, controlNameToMaxLength) {
        const unfilledRequiredControls = this.getUnfilledRequiredControls(controls, requiredControlNames);
        unfilledRequiredControls.forEach(c => CommonLibrary.executeInlineControlError(context, c, context.localizeText('field_is_required')));

        const maxLengthExceededControls = this.getMaxLengthExceededControls(controls, controlNameToMaxLength);  // we dont expect to have the same field being empty and exceeding the max char limit at the same time
        maxLengthExceededControls.forEach(c => CommonLibrary.executeInlineControlError(context, c, context.localizeText('exceeds_max_length_x_x', [c.getValue().length, controlNameToMaxLength[c.getName()]])));

        return [...unfilledRequiredControls, ...maxLengthExceededControls];
    }
}

class DirectiveBase {
    /**
     * @callback isAnyControlBoolCallback
     * @param {IControlProxy} controlProxy
     * @returns {boolean}
     */
    /**
     * @callback isAnyControlStrCallback
     * @param {IControlProxy} controlProxy
     * @returns {string}
     */
    /**
     * @param {IControlProxy} controlProxy
     * @param {isAnyControlStrCallback} inlineErrorMessage
     * @param {isAnyControlBoolCallback | undefined} isValidCallable returns true if the control is valid (e.g. if the control is required, it returns false if it's empty)
     * @param {isAnyControlBoolCallback | undefined} shouldRunCallable
     */
    constructor(controlProxy, inlineErrorMessage, isValidCallable, shouldRunCallable = undefined) {
        this.controlProxy = controlProxy;
        this.inlineErrorMessage = inlineErrorMessage;
        this.shouldRunCallable = shouldRunCallable;
        this.isValidCallable = isValidCallable;
    }

    /** @returns {Promise<boolean>} */
    applyError() {
        return Promise.resolve(this.shouldRunCallable ? this.shouldRunCallable(this.controlProxy) : true)
            .then(async shouldRun => [shouldRun, shouldRun && await Promise.resolve(this.isValidCallable(this.controlProxy))])  // lazy evaluate the validity check
            .then(([shouldRun, isValid]) => {
                if (!shouldRun || isValid) {
                    return true;
                }
                try {
                    CommonLibrary.executeInlineControlError(this.controlProxy, this.controlProxy, this.inlineErrorMessage(this.controlProxy));
                } catch (error) {
                    Logger.error('ValidationLibrary', error);
                }
                return false;
            });
    }
}

/**
 * @param {IControlProxy} controlProxy
 * @param {isAnyControlBoolCallback | undefined} isRequiredPredicate
 * @returns {Promise<boolean>}
 */
export function RequiredDirective(controlProxy, isRequiredPredicate = undefined) {
    return new DirectiveBase(controlProxy, (control) => control.localizeText('field_is_required'), (control) => !libThis.isControlEmpty(control), isRequiredPredicate).applyError();
}

/**
 * @param {IControlProxy} controlProxy
 * @param {isAnyControlBoolCallback | undefined} isRequiredPredicate
 * @returns {DirectiveBase}
 */
export function RequiredDirectivePartial(controlProxy, isRequiredPredicate = undefined) {
    return new DirectiveBase(controlProxy, (control) => control.localizeText('field_is_required'), (control) => !libThis.isControlEmpty(control), isRequiredPredicate);
}

/**
 * @param {IControlProxy} controlProxy
 * @returns {Promise<boolean>}
 */
export function IntegerDirective(controlProxy) {
    return new DirectiveBase(controlProxy, (control) => control.localizeText('forms_numeric_integer'), (control) => /^\d+$/.test(control.getValue()), (control) => !libThis.isControlEmpty(control)).applyError();
}
/**
 * @param {IControlProxy} controlProxy
 * @returns {DirectiveBase}
 */
export function IntegerDirectivePartial(controlProxy) {
    return new DirectiveBase(controlProxy, (control) => control.localizeText('forms_numeric_integer'), (control) => /^\d+$/.test(control.getValue()), (control) => !libThis.isControlEmpty(control));
}

/**
 * @param {IControlProxy} controlProxy
 * @returns {Promise<boolean>}
 */
export function MaxLengthDirective(controlProxy, maxLength) {
    return new DirectiveBase(controlProxy, (control) => control.localizeText('exceeds_max_length_x_x', [control.getValue().length, maxLength]), (control) => !libThis.isExceededMaxLength(control, maxLength), (control) => !libThis.isControlEmpty(control)).applyError();
}
/**
 * @param {IControlProxy} controlProxy
 * @returns {DirectiveBase}
 */
export function MaxLengthDirectivePartial(controlProxy, maxLength) {
    return new DirectiveBase(controlProxy, (control) => control.localizeText('exceeds_max_length_x_x', [control.getValue().length, maxLength]), (control) => !libThis.isExceededMaxLength(control, maxLength), (control) => !libThis.isControlEmpty(control));
}

/**
 * @param {IControlProxy} controlProxy
 * @param {isAnyControlBoolCallback | undefined} isValidPredicate
 * @param {isAnyControlBoolCallback | undefined} shouldRunPredicate
 * @param {isAnyControlStrCallback} getMessageCallback
 * @returns {Promise<boolean>}
 */
export function CustomDirective(controlProxy, isValidPredicate, shouldRunPredicate, getMessageCallback) {
    return new DirectiveBase(controlProxy, getMessageCallback, isValidPredicate, shouldRunPredicate).applyError();// eslint-disable-line no-unused-vars
}
