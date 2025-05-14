/**
 * Warn if there are unsaved changes
 * 
 * @param {IClientAPI} context 
 */
export default function FormRunnerOnBackButtonPressed(context) {
    const pageProxy = context.getPageProxy();

    const webview = pageProxy.getControl('ExtensionControl0')._control.getWebView();
    
    const callback = (result) => {
        if (result) {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        } else {
            return context.executeAction('/SAPAssetManager/Actions/Page/ConfirmClosePage.action');
        }
    };
    const timeout = 5000; // 5 second timeout if we get no response
    
    return webview.getIsFormDataSafe(callback, timeout);
}
