import DownloadDocumentsPageCaption from './DownloadDocumentsPageCaption';
import libDoc from '../DocumentLibrary';

export default function DownloadDocumentsDeselectAll(context) {
    context.showActivityIndicator('');

    const { pageProxyClientData, selectableSections, pageProxy, totalSection } = libDoc.getDownloadDocumentsDataFromContext(context);

    pageProxyClientData.selectedDocuments = {};
    pageProxy.setCaption(DownloadDocumentsPageCaption(context));
    pageProxy.setActionBarItemVisible('DeselectAll', false);
    pageProxy.setActionBarItemVisible('SelectAll', true);

    selectableSections.forEach(section => {
        if (section.getVisible()) {
            section.redraw(true);
        }
    });

    if (totalSection) {
        totalSection.redraw(true).then(() => {
            context.dismissActivityIndicator();
        });
    } else {
        context.dismissActivityIndicator();
    }
}
