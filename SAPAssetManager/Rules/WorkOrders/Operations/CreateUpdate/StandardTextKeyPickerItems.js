
export default function StandardTextKeyPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'StandardTextKeys', [], '')
        .catch(() => [])  // expect: entityset does not exists
        .then(stks => Array.from(stks, stk => ({
            DisplayValue: stk.Description,
            ReturnValue: stk.TextKey,
        })));
}
