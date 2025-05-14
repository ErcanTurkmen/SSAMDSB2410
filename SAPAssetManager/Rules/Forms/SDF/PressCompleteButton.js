/**
 * attempt to press the 'complete' button in the form
 * 
 * @param {IClientAPI} context 
 */
export default function PressCompleteButton(context) {
    const clientData = context.evaluateTargetPath('#Page:FormRunner/#ClientData');

    let currentStatus = context.binding.DynamicFormInstance_Nav.FormStatus;

    if (clientData && clientData.FormData) {
        currentStatus = clientData.FormData.PreviousStatus;
    }

    const pageProxy = context.getPageProxy();
    const webView = pageProxy.getControl('ExtensionControl0')._control.getWebView();

    switch (currentStatus) {
        case 'In Process':
        case 'Reopened':
            // save-final
            webView.pressButton('save-final');
            break;
        case 'Completed':
        case 'Final':
            // close page
            return pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        default:
            // error to save page first
            return pageProxy.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
                'Properties': {
                    'Title': pageProxy.localizeText('error'),
                    'Message': pageProxy.localizeText('sdf_page_not_completable'),
                    'OKCaption': pageProxy.localizeText('ok'),
                },
            });
    }
}
