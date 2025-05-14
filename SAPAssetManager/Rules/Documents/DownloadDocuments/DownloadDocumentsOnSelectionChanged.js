import DownloadDocumentsPageCaption from './DownloadDocumentsPageCaption';
import libDoc from '../DocumentLibrary';

export default function DownloadDocumentsOnSelectionChanged(context) {
    const { pageProxyClientData, selectableSections, pageProxy, totalSection } = libDoc.getDownloadDocumentsDataFromContext(context);

    selectableSections.forEach(section => {
        const lastChanged = section.getSelectionChangedItem();
        if (lastChanged) { 
            const lastChangedDocumentID = lastChanged.binding.DocumentID;

            if (lastChanged.selected) {
                if (pageProxyClientData.selectedDocuments && Object.keys(pageProxyClientData.selectedDocuments).length === 0) {
                    pageProxy.setActionBarItemVisible('DeselectAll', true);
                    pageProxy.setActionBarItemVisible('SelectAll', false);
                }

                pageProxyClientData.selectedDocuments[lastChangedDocumentID] = lastChanged.binding;
            } else {
                delete pageProxyClientData.selectedDocuments[lastChangedDocumentID];

                if (pageProxyClientData.selectedDocuments && Object.keys(pageProxyClientData.selectedDocuments).length === 0) {
                    pageProxy.setActionBarItemVisible('DeselectAll', false);
                    pageProxy.setActionBarItemVisible('SelectAll', true);
                }
            }

            pageProxy.setCaption(DownloadDocumentsPageCaption(context));

            if (totalSection) {
                totalSection.redraw(true);
            }

            section._context.element._changedItem = undefined;
        }
    });
}
