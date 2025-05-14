import DownloadDocumentsErrorsTarget from './DownloadDocumentsErrorsTarget';

export default function DownloadDocumentsErrorsListViewCaption(context) {
    return context.localizeText('errors_x', [DownloadDocumentsErrorsTarget(context).length]);
}
