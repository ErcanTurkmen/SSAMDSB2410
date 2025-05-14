import DownloadDocumentsPageCaption from './DownloadDocumentsPageCaption';
import libDoc from '../DocumentLibrary';

export default function DownloadDocumentsSelectAll(context) {
    context.showActivityIndicator('');

    const { pageProxyClientData, selectableSections, pageProxy, documentsList, totalSection } = libDoc.getDownloadDocumentsDataFromContext(context);
    const selectedDocuments = {};

    documentsList.forEach(documentsInfo => {
        documentsInfo.documents.forEach(doc => {
            selectedDocuments[doc.DocumentID] = doc;
        });
    });

    pageProxyClientData.selectedDocuments = selectedDocuments;
    pageProxy.setCaption(DownloadDocumentsPageCaption(context));
    pageProxy.setActionBarItemVisible('DeselectAll', true);
    pageProxy.setActionBarItemVisible('SelectAll', false);

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
