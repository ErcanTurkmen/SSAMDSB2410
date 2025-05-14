export const ChangeExistingDescriptionTypes = Object.freeze({
    append: 'append',
    replace: 'replace',
});

export default function ChangeExistingDescriptionPickerItems(context) {
    return Object.values(ChangeExistingDescriptionTypes)
        .map(key => ({
            ReturnValue: key,
            DisplayValue: context.localizeText(key),
        }));
}
