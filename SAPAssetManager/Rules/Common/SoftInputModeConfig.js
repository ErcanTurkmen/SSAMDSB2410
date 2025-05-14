
export default function SoftInputModeConfig(context, config = undefined) {
    if (context.nativescript.platformModule.isAndroid) {
        if (context._page && context._page._context && config) {
            context._page._context.getWindow().setSoftInputMode(config);
        }
    }
}
