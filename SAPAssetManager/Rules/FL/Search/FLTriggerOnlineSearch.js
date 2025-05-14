import libCom from '../../Common/Library/CommonLibrary';
import FLFetchQueryOptions from '../Fetch/FLFetchQueryOptions';
import FLDownloadDocuments from '../Fetch/FLDownloadDocuments';
import { FLDocumentTypeValues } from '../Common/FLLibrary';
/**
* Function which is called after initializing of online services
* It check amount of available documents in the online service depending on entered data
* For FLFetchDocuments page, all data (QueryOptions) is taken out from there
* After getting of the count of the documents in the online service we have 3 ways of reaction:
* 0 - show error message (documents not found)
* 1 - automatically call download funtions with details of the document
* 2 and more - we open FLFetchDocumentsOnline page to provide to user ability to choose documents
* @param {IClientAPI} context
*/
export default async function FLTriggerOnlineSearch(context) {
    const downloadStarted = libCom.getStateVariable(context, 'DownloadFLDocsStarted');
    const customQuery = FLFetchQueryOptions(context);
    if (!downloadStarted) {
        return customQuery.build().then(options => {
            return context.count('/SAPAssetManager/Services/OnlineAssetManager.service', 'FldLogsVoyages', options).then(count => {
                switch (count) {
                    case 0:
                        return context.executeAction({
                            'Name': '/SAPAssetManager/Actions/SyncErrorBannerMessage.action',
                            'Properties': {
                                'Message': context.localizeText('no_documents_found_on_online_search'),
                            },
                        });
                    case 1:
                        return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'FldLogsVoyages', [], options).then(data => {
                            const item = data.getItem(0);
                            const documents = [];
                            const document = Object();
                            document.ObjectId = item.VoyageStageUUID;
                            document.FLObject = FLDocumentTypeValues.Voyage;
                            documents[0] = document;
                            libCom.setStateVariable(context, 'Documents', documents);
                            libCom.setStateVariable(context, 'DownloadFLDocsStarted', true);
                            return FLDownloadDocuments(context);
                        });
                    default: {
                        context.executeAction('/SAPAssetManager/Actions/FL/Fetch/FLFetchDocumentsOnline.action');
                        return true;
                    }
                } 
            });
        });
    }
}

