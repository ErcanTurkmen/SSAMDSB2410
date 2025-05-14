import libVal from '../Common/Library/ValidationLibrary';
import libCommon from '../Common/Library/CommonLibrary';

export default function DownloadHTMLTemplate(pageProxy) {
    const serviceName = '/SAPAssetManager/Services/AssetManager.service';
    const S4ServiceIntegrationGlobal = pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Features/S4ServiceData.global').getValue();
    const CSServiceOrderGlobal = pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Features/CSServiceData.global').getValue();
    const PMWorkOrderGlobal = pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMWorkOrder.global').getValue();
    return pageProxy.read(serviceName, 'ReportTemplates', [], '$expand=Document_Nav').then(async documents => {
        if (!libVal.evalIsEmpty(documents)) {
            for (let i = 0; i < documents.length; i++) {
                let template = documents.getItem(i);
                let documentObject = template.Document_Nav;
                let readLink = documentObject['@odata.readLink'];
                let stateVarName = getStateName(template.FeatureID, CSServiceOrderGlobal, S4ServiceIntegrationGlobal, PMWorkOrderGlobal);
                if (pageProxy.currentPage && pageProxy.currentPage.context) {
                    pageProxy.currentPage.context.clientData.ReportTemplate = template;
                }
                libCommon.setStateVariable(pageProxy, stateVarName, template);

                const docDownloadID = 'DocDownload.' + documentObject.DocumentID;
                let entitySet = readLink.split('(')[0];

                await pageProxy.isMediaLocal(serviceName, entitySet, readLink).then((isMediaLocal) => {
                    if (!isMediaLocal) {
                        return pageProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreams.action')
                            .then((result) => {
                                libCommon.clearStateVariable(pageProxy, stateVarName);
                                return returnResult(result, pageProxy, docDownloadID);
                            }, () => {
                                libCommon.clearFromClientData(pageProxy, docDownloadID, undefined, true);
                                libCommon.clearStateVariable(pageProxy, stateVarName);
                                return pageProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreamsFailure.action');
                            });
                    }
                    libCommon.clearStateVariable(pageProxy, stateVarName);
                    return Promise.resolve();
                });
            }
        }
        return Promise.resolve();
    }); 
}

function getStateName(featureID, CSServiceOrderGlobal, S4ServiceIntegrationGlobal, PMWorkOrderGlobal) {
    let stateVarName;
    if (featureID === CSServiceOrderGlobal) {
        stateVarName = 'CSReportTemplate';
    } else if (featureID === S4ServiceIntegrationGlobal) {
        stateVarName = 'S4ReportTemplate';
    } else if (featureID === PMWorkOrderGlobal) {
        stateVarName = 'PMReportTemplate';
    }
    return stateVarName;
}

function returnResult(result, pageProxy, docDownloadID) {
    if (result.data && result.data.search(/error/i)) {
        libCommon.clearFromClientData(pageProxy, docDownloadID, undefined, true);
        return pageProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreamsFailure.action');
    }
    return Promise.resolve();
}
