/**
 * Returns true if the confirmation indicator is not 3
 * @param {IClientAPI} context
 */
export default function IsConfirmationEnabledOperation(context, actionBinding) {
    const binding = actionBinding || context.binding;

    if (!binding) return Promise.resolve(false);
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ControlKeys', ['ConfirmationIndicator'], "$filter=ControlKey eq '" + binding.ControlKey + "'").then(function(result) {
        return result.getItem(0).ConfirmationIndicator !== '3';
    });
}
