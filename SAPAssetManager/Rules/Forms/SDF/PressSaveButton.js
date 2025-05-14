/**
 * attempt to press the 'save' button in the form
 * 
 * @param {IClientAPI} context 
 */
export default function PressSaveButton(context) {
    const clientData = context.evaluateTargetPath('#Page:FormRunner/#ClientData');

    let currentStatus = context.binding.DynamicFormInstance_Nav.FormStatus;

    if (clientData && clientData.FormData) {
        currentStatus = clientData.FormData.PreviousStatus;
    }

    const pageProxy = context.getPageProxy();
    const webView = pageProxy.getControl('ExtensionControl0')._control.getWebView();

    switch (currentStatus) {
        case 'Completed':
        case 'Final':
            // close page
            return pageProxy.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
                'Properties': {
                    'Title': pageProxy.localizeText('error'),
                    'Message': pageProxy.localizeText('sdf_page_completed_or_final'),
                    'OKCaption': pageProxy.localizeText('ok'),
                },
            });
        default:
            webView.pressButton('save-not-final');
            break;
    }
}
