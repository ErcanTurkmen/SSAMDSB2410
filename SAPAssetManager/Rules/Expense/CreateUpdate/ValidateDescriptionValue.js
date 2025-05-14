import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ValidateDescriptionValue(context, descControl) {
    const charLimit = context.getGlobalDefinition('/SAPAssetManager/Globals/Expense/ExpenseDescriptionMaxLength.global').getValue();
    const descriptionValue = descControl.getValue() ? descControl.getValue().trim() : '';

    if (descriptionValue.length <= charLimit) {
        return Promise.resolve(true);
    } else {
        const dynamicParams = [charLimit];
        const message = context.localizeText('validation_maximum_field_length', dynamicParams);
        CommonLibrary.executeInlineControlError(context, descControl, message);
        return Promise.reject(false);
    }
}
