import DownloadDocumentsOnDownloadPress from './DownloadDocumentsOnDownloadPress';

export default function DownloadDocumentsRetryDownload(context) {
    const pageProxy = context.getPageProxy();
    const documents = pageProxy.getClientData().downloadDocumentsErrors.map(error => error.Document);
    DownloadDocumentsOnDownloadPress(pageProxy, documents);
}
