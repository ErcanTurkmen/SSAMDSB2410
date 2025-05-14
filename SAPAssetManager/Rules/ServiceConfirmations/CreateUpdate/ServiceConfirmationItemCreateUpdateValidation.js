import CommonLibrary from '../../Common/Library/CommonLibrary';
import TechnicalObjectCreateUpdateValidation from '../../Common/Validation/TechnicalObjectCreateUpdateValidation';
import ValidateActualWorkValue from '../../Expense/CreateUpdate/ValidateActualWorkValue';

export default function ServiceConfirmationItemCreateUpdateValidation(context) {
    return TechnicalObjectCreateUpdateValidation(context).then(() => {
        const amountControl = CommonLibrary.getControlProxy(context, 'AmountProperty');
        const quantitySimple = CommonLibrary.getControlProxy(context, 'QuantitySimple');
        const message = context.localizeText('quantity_must_be_greater_than_zero');
        if (quantitySimple.getValue() === '0') {
            CommonLibrary.executeInlineControlError(context, quantitySimple, message);
            return Promise.reject(false);
        }
        if (amountControl.getVisible() && amountControl.getValue() === 0) {
            CommonLibrary.executeInlineControlError(context, amountControl, message);
            return Promise.reject(false);
        }
        return ValidateActualWorkValue(context, amountControl, 29, 9);
    });
}
