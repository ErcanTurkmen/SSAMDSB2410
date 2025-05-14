
import PDFViewOnUnloaded from './PDFViewOnUnloaded';

export default function PDFViewCancel(context) {
    return PDFViewOnUnloaded(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
    });
}
