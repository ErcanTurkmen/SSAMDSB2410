
import partsIssueEDTQuantityValue from './PartsIssueEDTQuantityValue';

export default async function PartsIssueEDTQuantityValueChange(context) {
    const value = context?._control?.getValue();
    const row = context?._control?.getRow();
    const quantity = await partsIssueEDTQuantityValue(context, row.OdataBinding);

    if (value > quantity) {
        context?._control?.applyValidation(context.localizeText('validation_greater_than_available_quantity'));
    } else if (value < 0) {
        context?._control?.applyValidation(context.localizeText('quantity_must_be_greater_than_zero'));
    } else {
        context?._control?.clearValidation();
    }
}
