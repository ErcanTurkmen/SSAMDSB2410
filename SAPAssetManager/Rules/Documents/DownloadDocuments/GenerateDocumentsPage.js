import WCMDocumentItemSequence from '../../WCM/OperationalItems/WCMDocumentItemSequence';
import { formatDocumentsSize } from './DownloadDocumentsTotalSize';
import libCom from '../../Common/Library/CommonLibrary';

export default async function GenerateDocumentsPage(clientAPI) {
    const pageProxyClientData = clientAPI.getClientData();
    const documentsList = pageProxyClientData.documentsList || [];

    let page = clientAPI.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/Documents/DownloadDocuments.page');
    let sections = page.Controls[0].Sections;

    let index = 0;
    for (const documentSectionInfo of documentsList) {
        let caption = await generateSectionCaption(clientAPI, documentSectionInfo);
        let name = 'DocumentsSection' + index;

        sections.push(
            {
                'Search': {
                    'Enabled': false,
                },
                'Selection': {
                    'Mode': 'Multiple',
                    'ExitOnLastDeselect': false,
                },
                'Header': {
                    'UseTopPadding': true,
                    'Caption': caption,
                },
                'ObjectCell': {
                    'DetailImage': '/SAPAssetManager/Rules/Documents/DocumentTypeIcon.js',
                    'DetailImageIsCircular': false,
                    'PreserveIconStackSpacing': false,
                    'Title': '/SAPAssetManager/Rules/Documents/DocumentFileName.js',
                    'Subhead': '/SAPAssetManager/Rules/Documents/DocumentDescription.js',
                    'StatusText': '/SAPAssetManager/Rules/Documents/DocumentFileSizeWrapper.js',
                    'Selected': '/SAPAssetManager/Rules/Documents/DownloadDocuments/DownloadDocumentsCellSelected.js',
                },
                'Target': `{documentsList/${index}/documents}`,
                'OnSelectionChanged': '/SAPAssetManager/Rules/Documents/DownloadDocuments/DownloadDocumentsOnSelectionChanged.js',
                '_Name': name,
                '_Type': 'Section.Type.ObjectTable',
            },
        );

        index++;
    }

    return page;
}

const pageTitles = {
    'WorkOrderDetailsPage': 'work_order_documents_section_title',
    'WorkOrderDetailsWithObjectCardsPage': 'work_order_documents_section_title',
    'OperationDetailsPage': 'operation_documents_section_title',
    'WorkOrderOperationDetailsWithObjectCards': 'operation_documents_section_title',
    'NotificationDetailsPage': 'notification_documents_section_title',
    'NotificationDetailsClassicPage': 'notification_documents_section_title',
    'EquipmentDetailsPage': 'equipment_documents_section_title',
    'FunctionalLocationDetails': 'functional_location_documents_section_title',
};

async function generateSectionCaption(clientAPI, documentSectionInfo) {
    let id = documentSectionInfo.ids[documentSectionInfo.ids.length - 1] || '';
    let list = documentSectionInfo.documents;
    let size = formatDocumentsSize(list);
    const page = libCom.getPageName(clientAPI);

    let key;
    let params = [size];

    switch (documentSectionInfo.type) {
        case 'MAIN': {
            if (Object.prototype.hasOwnProperty.call(pageTitles, page)) {
                key = pageTitles[page];
            } else {
                key = 'main_documents_section_title';
            }
            break;
        }
        case 'EQUIPMENT' : {
            key = 'equipment_documents_section_title_x';
            params.unshift(id);
            break;
        }
        case 'FLOC': {
            key = 'functional_location_documents_section_title_x';
            id = await clientAPI.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${id}')`, ['FuncLocId'], '').then(function(result) { 
                if (result.length) {
                    return result.getItem(0).FuncLocId;
                }
                return '';
            });
            params.unshift(id);
            break;
        }
        case 'ITEMS': {
            key = 'item_documents_section_title';
            let item = await clientAPI.read('/SAPAssetManager/Services/AssetManager.service', `WCMDocumentItems(WCMDocument='${documentSectionInfo.ids[0]}',WCMDocumentItem='${documentSectionInfo.ids[1]}')`, [], '').then(function(result) { 
                if (result.length) {
                    return result.getItem(0);
                }
                return {};
            });
            params.unshift(WCMDocumentItemSequence(clientAPI, item));
            break;
        }
        case 'OPERATIONS': {
            key = 'operation_documents_section_title_x';
            params.unshift(id);
            break;
        }
        default: break;
    }

    return clientAPI.localizeText(key, params);
}
