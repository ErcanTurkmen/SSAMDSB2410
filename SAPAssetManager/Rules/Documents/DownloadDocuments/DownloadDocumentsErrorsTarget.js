import libVal from '../../Common/Library/ValidationLibrary';

export default function DownloadDocumentsErrorsTarget(context) {
    const pageProxy = context.getPageProxy();
    const clientData = pageProxy.getClientData();
    let errors = clientData.downloadDocumentsErrors || [];

    if (libVal.evalIsEmpty(errors)) {
        const prevPageClientData = context.evaluateTargetPath('#Page:-Previous/#ClientData');
        errors = prevPageClientData.downloadDocumentsErrors;
        clientData.downloadDocumentsErrors = errors;

        delete prevPageClientData.downloadDocumentsErrors;
    }

    return errors;
}
