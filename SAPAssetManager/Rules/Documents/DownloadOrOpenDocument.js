import GetDocumentSection from './GetDocumentSection';
import DocumentPath from './DocumentPath';
import libVal from '../Common/Library/ValidationLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import writeDocument from './Save/DocumentSave';
import Logger from '../Log/Logger';
import setFileInfo from './DocumentEditorSetFileInfo';
import isPdfFormat from './DocumentEditorIsPdfFormat';
import isImageFormat from './DocumentEditorIsImageFormat';
import libPersona from '../Persona/PersonaLibrary';
import { isSignatureDeleteEnabled } from '../UserAuthorizations/WorkOrders/EnableSignatureDiscard';
import URLModuleLibrary from '../../Extensions/URLModule/URLModuleLibrary';

export default function DownloadOrOpenDocument(sectionedTableProxy, documentPropertyName) {
    const pageProxy = sectionedTableProxy.getPageProxy();
    let documentObject = pageProxy.getActionBinding()[documentPropertyName];
    let readLink = documentObject['@odata.readLink'];
    let serviceName = '/SAPAssetManager/Services/AssetManager.service';
    let entitySet = readLink.split('(')[0];
    const docDownloadID = 'DocDownload.' + documentObject.DocumentID;

    if (documentObject.ObjectType === 'URL') {
        // Workaround function to address iOS 18 removal of openUrl function
        return Promise.resolve(URLModuleLibrary.openUrl(documentObject.URL.replace('&KEY&', '')));
    } else {
        // Check if media already exists or needs to be downloaded
        return sectionedTableProxy.isMediaLocal(serviceName, entitySet, readLink).then((isMediaLocal) => {
            if (isMediaLocal) {
                let documentPath = DocumentPath(sectionedTableProxy, documentObject);

                let writeError = undefined;
                let promise = Promise.resolve(documentPath);

                if (!sectionedTableProxy.nativescript.fileSystemModule.File.exists(documentPath)) {
                    // action overwrite as getActionBinding method is undefined in MDK 6.1.1-ms-12-08
                    promise = sectionedTableProxy.executeAction({
                        'Name': '/SAPAssetManager/Actions/Documents/DownloadMedia.action', 'Properties': {
                            'Target': {
                                'EntitySet': 'Documents',
                                'ReadLink': readLink,
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                            },
                            'OnSuccess': '',
                        },
                    }).then(() => {
                        writeDocument(pageProxy, documentObject);
                        // the media has been downloaded, we can open it -> the path needs to be provided in the action definition
                        // or it should come from binding
                        let documentFileObject = sectionedTableProxy.nativescript.fileSystemModule.File.fromPath(documentPath);
                        let content = pageProxy.getClientData()[documentObject['@odata.readLink']];
                        if (libVal.evalIsEmpty(documentPath) || typeof documentObject === 'undefined') {
                            return pageProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreamsFailure.action');
                        }
                        documentFileObject.writeSync(content, err => {
                            writeError = err;
                        });
                        libCommon.removeStateVariable(sectionedTableProxy, docDownloadID);
                        return documentPath;
                    }).catch(err => {
                        Logger.error(err);
                    });
                }

                return promise.then(docPath => {
                    if (writeError) {
                        return pageProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreamsFailure.action');
                    } else {
                        const fileName = documentObject.FileName;
                        if (!libPersona.isWCMOperator(pageProxy) && (isImageFormat(fileName) || isPdfFormat(fileName))) {
                            libCommon.setStateVariable(pageProxy, 'DocumentEditorNavType', 'DocumentList');
                            libCommon.setStateVariable(pageProxy, 'DocumentEditorDescription', documentObject.Description);
                            const directory = docPath.substring(0, docPath.lastIndexOf(fileName));
                            return isSignatureDeleteEnabled(pageProxy, pageProxy.getActionBinding(), !!documentObject['@sap.isLocal'], documentPropertyName).then(isEnabled => {
                                setFileInfo(pageProxy, {
                                    FileName: fileName, Directory: directory, IsDeleteAllowed: isEnabled,
                                });
                                return pageProxy.executeAction('/SAPAssetManager/Actions/Documents/DocumentEditorNav.action');
                            });
                        } else {
                            pageProxy.setActionBinding({
                                'FileName': docPath,
                            });
                            let actionPath = '/SAPAssetManager/Actions/Documents/DocumentOpen.action';
                            return pageProxy.executeAction(actionPath);
                        }
                    }
                }).catch(err => {
                    Logger.error(err);
                    if (err.message && err.message.includes('No viewer')) {
                        return pageProxy.executeAction({
                            'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
                            'Properties': {
                                'Title': pageProxy.localizeText('error'),
                                'Message': pageProxy.localizeText('no_viewer_message'),
                                'OKCaption': pageProxy.localizeText('ok'),
                            },
                        });
                    }
                    return null;
                });
            } else {
                // The media is on the server. This server could be SAP backend or it could be cached on OData Offline Service on HCP.
                // We need to download it.

                /*
                    Check state of media. If media download is already in progress, then prevent user from requesting
                    media from server again. Multiple clicks from the user, send multiple requests for the same media
                    to the server, resulting in errors being thrown and the document still downloading successfully.
                */
                let isDownloadInProgress = libCommon.getStateVariable(sectionedTableProxy, docDownloadID);
                // If download is already in progress, ignore the click from user.
                if (!isDownloadInProgress) {
                    // The media is on the server. This is the user's first request\click to download the media.

                    //Set internal media state to 'in progress'.
                    libCommon.setStateVariable(sectionedTableProxy, docDownloadID, 'inProgress');

                    //Set indicator icon on ObjectCell to be 'in progress' pic to tell user download of media is in progress.
                    const pressedItem = pageProxy.getPressedItem();
                    const documentsSection = GetDocumentSection(sectionedTableProxy.getSections());
                    setIndicatorStateOrRedrawSection(pressedItem, documentsSection, 'inProgress');

                    return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreams.action')
                        .then((result) => {
                            //MDK OfflineOData.Download action returns a resoved Promise on download error. This bug is fixed in MDK 2.1.200.
                            if (result.data && result.data.search(/error/i)) {
                                libCommon.removeStateVariable(sectionedTableProxy, docDownloadID);
                                setIndicatorStateOrRedrawSection(pressedItem, documentsSection, 'toDownload');
                                return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreamsFailure.action');
                            }
                            return Promise.resolve();
                        }, () => {
                            libCommon.removeStateVariable(sectionedTableProxy, docDownloadID);
                            setIndicatorStateOrRedrawSection(pressedItem, documentsSection, 'toDownload');
                            return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreamsFailure.action');
                        });
                } else {
                    return Promise.resolve();
                }
            }
        });
    }
}

function setIndicatorStateOrRedrawSection(pressedItem, section, state) {
    const pressedItemExists = !libVal.evalIsEmpty(pressedItem);
    if (pressedItemExists) {
        section.setIndicatorState(state, pressedItem);
    } else {
        section.redraw();
    }
}
