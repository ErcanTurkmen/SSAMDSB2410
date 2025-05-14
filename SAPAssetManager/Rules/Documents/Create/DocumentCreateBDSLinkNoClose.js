import CommonLib from '../../Common/Library/CommonLibrary';
import DocLib from '../DocumentLibrary';

export default function DocumentCreateBDSLinkNoClose(controlProxy) {
    const binding = CommonLib.getPageName(controlProxy) === 'PDFControl' ? CommonLib.getStateVariable(controlProxy, 'ServiceReportData') : controlProxy.binding;
    let parentReadLink = binding['@odata.readLink'];
    const readLinks = controlProxy.getClientData().mediaReadLinks;


    switch (DocLib.getParentObjectType(controlProxy)) {
        case DocLib.ParentObjectType.WorkOrder:
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'WOHeader', 'MyWorkOrderHeaders', 'MyWorkOrderDocuments', { ObjectKey: binding.OrderId });
        case DocLib.ParentObjectType.MaterialDocument: {
            parentReadLink = binding.TempHeader_MatDocReadLink;
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'MaterialDocument_Nav', 'MaterialDocuments', 'MatDocAttachments', { ObjectKey: parentReadLink.MaterialDocNumber});
        }
        case DocLib.ParentObjectType.MaterialDocItem: {
            parentReadLink = binding.AssociatedMaterialDoc['@odata.readLink'];
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'MaterialDocument_Nav', 'MaterialDocuments', 'MatDocAttachments', { ObjectKey: binding.AssociatedMaterialDoc.MaterialDocNumber});
        }
        case DocLib.ParentObjectType.Notification:
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'NotifHeader', 'MyNotificationHeaders', 'MyNotifDocuments', { ObjectKey: binding.NotificationNumber });
        case DocLib.ParentObjectType.Equipment:
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'Equipment', 'MyEquipments', 'MyEquipDocuments', { ObjectKey: binding.EquipId });
        case DocLib.ParentObjectType.FunctionalLocation:
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'FunctionalLocation', 'MyFunctionalLocations', 'MyFuncLocDocuments', { ObjectKey: binding.FuncLocIdIntern });
        case DocLib.ParentObjectType.Operation:
        case DocLib.ParentObjectType.SubOperation:
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'WOOperation_Nav', 'MyWorkOrderOperations', 'MyWorkOrderDocuments', { ObjectKey: binding.OperationNo[0] === 'L' ? binding.OperationNo : binding.ObjectKey });
        case DocLib.ParentObjectType.InspectionLot: {
            let objectKey = '';
            if (binding['@odata.type'] === '#sap_mobile.InspectionLot') {
                parentReadLink = binding['@odata.readLink'];
                objectKey = binding.InspectionLot;
            } else if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', `${binding.WOHeader['@odata.readLink']}/InspectionLot_Nav`, [], '').then(result => {
                    if (result && result.length > 0) {
                        parentReadLink = result.getItem(0)['@odata.readLink'];
                        objectKey = result.getItem(0).InspectionLot;
                        return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'InspectionLot_Nav', 'InspectionLots', 'InspectionLotDocuments', { ObjectKey: objectKey });
                    }
                    return '';
                });
            } else {
                parentReadLink = binding.InspectionLot_Nav['@odata.readLink'];
                objectKey = binding.InspectionLot_Nav.InspectionLot;
            }
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'InspectionLot_Nav', 'InspectionLots', 'InspectionLotDocuments', { ObjectKey: objectKey });
        }
        case DocLib.ParentObjectType.WCMDocumentItem:
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'WCMDocumentItems', 'WCMDocumentItems', 'WCMDocumentItemAttachments', { ObjectKey: binding.ObjectNumber });
        case DocLib.ParentObjectType.S4ServiceOrder:
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'S4ServiceOrder_Nav', 'S4ServiceOrders', 'S4ServiceOrderDocuments', { ObjectKey: binding.ObjectID });
        case DocLib.ParentObjectType.S4ServiceItem:
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'S4ServiceItem_Nav', 'S4ServiceItems', 'S4ServiceOrderDocuments', { ObjectKey: binding.ObjectID, ItemNo: binding.ItemNo });
        case DocLib.ParentObjectType.S4ServiceConfirmation:
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'S4ServiceConfirmation_Nav', 'S4ServiceConfirmations', 'S4ServiceConfirmationDocuments', { ObjectKey: binding.ObjectID, ObjectID: binding.ObjectID });
        case DocLib.ParentObjectType.S4ServiceConfirmationItem:
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'S4ServiceConfirmationItem_Nav', 'S4ServiceConfirmationItems', 'S4ServiceConfirmationDocuments', { ObjectKey: binding.ObjectID, ItemNo: binding.ItemNo });
        case DocLib.ParentObjectType.S4ServiceRequest:
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'S4ServiceRequest_Nav', 'S4ServiceRequests', 'S4ServiceRequestDocuments', { HeaderID: binding.ObjectID, ObjectID: binding.ObjectID });
        case DocLib.ParentObjectType.S4ServiceQuotation:
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'S4ServiceQuotation_Nav', 'S4ServiceQuotations', 'S4ServiceQuotationDocuments', { HeaderID: binding.ObjectID, ObjectID: binding.ObjectID });
        case DocLib.ParentObjectType.S4ServiceQuotationItem:
            return CreateBDSLinks(controlProxy, readLinks, parentReadLink, 'S4ServiceQuotItem_QuotDoc', 'S4ServiceQuotationItems', 'S4ServiceQuotationDocuments', { ObjectKey: binding.ObjectID, ItemNo: binding.ItemNo });    
        default:
            return controlProxy.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action');
    }
}

export function CreateBDSLinks(controlProxy, readLinks, parentReadLink, parentProperty, parentEntitySet, entitySet, properties) {
    const promises = CreateDocumentLinkPromises(controlProxy, readLinks, parentReadLink, parentProperty, parentEntitySet, entitySet, properties);
    return Promise.all(promises).then(() => true)
        .catch(() => controlProxy.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action'));
}

export function CreateDocumentLinkPromises(controlProxy, readLinks, parentReadLink, parentProperty, parentEntitySet, entitySet, properties) {
    return readLinks && parentReadLink ? readLinks.map(readLink => {
        const links = [
            controlProxy.createLinkSpecifierProxy(parentProperty, parentEntitySet, '', parentReadLink),
            controlProxy.createLinkSpecifierProxy('Document', 'Documents', '', readLink),
        ];
        return controlProxy.create('/SAPAssetManager/Services/AssetManager.service', entitySet, properties, links, { 'OfflineOData.RemoveAfterUpload': 'true' });
    }) : [];
}
