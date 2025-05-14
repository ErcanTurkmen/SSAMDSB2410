import libCom from '../../Common/Library/CommonLibrary';
import DownloadDocuments from '../Fetch/DownloadDocuments';
import EWMQueryOptions from '../Fetch/EWMQueryOptions';
import GetResource from '../Resource/GetResource';
/**
* Function which is called after initializing of online services
* It check amount of available documents in the online service depending on entered data
* If data is not exist in SearchStringOnline state variable it means that function is triggered by
* FetchDocuments page, not search field. So all data (QueryOptions) is taken out from there
* If function is triggered from search bar, than we mannualy set required filter values for creating Query options
* After getting of the count of the documents in the online service we have 3 ways of reaction:
* 0 - show error message (documents not found)
* 1 - automatically call download funtions with details of the document
* 2 and more - we open FetchDocumentsOnline page to provide to user ability to choose documents
* @param {IClientAPI} context
*/
import { DocumentTypes, DefiningRequestsLite } from '../Common/EWMLibrary';
export default async function TriggerOnlineSearch(context) {
    const downloadStarted = libCom.getStateVariable(context, 'DownloadEWMDocsStarted');
    const customQuery = EWMQueryOptions(context);
    const documentType = libCom.getListPickerValue(context.evaluateTargetPath('#Page:EWMFetchDocumentsPage/#Control:DocumentTypeListPicker').getValue());
    let entitySet;
    if (!documentType) {
        return Promise.resolve(false);
    }
    if (documentType === DocumentTypes.WarehouseOrder) {
        entitySet = DefiningRequestsLite.WarehouseOrders;
    } else if (documentType === DocumentTypes.WarehouseTask) {
        entitySet = DefiningRequestsLite.WarehouseTasks;
    }
    if (!downloadStarted) {
        return customQuery.build().then(options => {
            return context.count('/SAPAssetManager/Services/OnlineAssetManager.service', entitySet, options).then(count => {
                switch (count) {
                    case 0:
                        return context.executeAction({
                            'Name': '/SAPAssetManager/Actions/SyncErrorBannerMessage.action',
                            'Properties': {
                                'Message': context.localizeText('no_documents_found_on_online_search'),
                            },
                        });
                    case 1:
                        {
                            const getData = context.read('/SAPAssetManager/Services/OnlineAssetManager.service', entitySet, [], options);
                            return Promise.all([getData, GetResource(context)]).then(([data, resource]) => {
                                if ((data.length === 1) && !resource) {
                                    let item = data.getItem(0);
                                    let documents = [];
                                    let document = Object();
                                    document.WarehouseNo = item.WarehouseNo;
                                    document.WarehouseOrder = item.WarehouseOrder;
                                    document.DocumentType = documentType;
                                    document.Resource = '';
                                    documents[0] = document;
                                    libCom.setStateVariable(context, 'Documents', documents);
                                    libCom.setStateVariable(context, 'DownloadEWMDocsStarted', true);
                                    return DownloadDocuments(context);
                                } else {
                                    context.executeAction('/SAPAssetManager/Actions/EWM/Fetch/FetchDocumentsOnline.action');
                                    //return true to close progress banner message
                                    return true;
                                }
                            });
                        }
                    default: {
                        context.executeAction('/SAPAssetManager/Actions/EWM/Fetch/FetchDocumentsOnline.action');
                        //return true to close progress banner message
                        return true;
                    }
                }
            });
        });
    }
}
