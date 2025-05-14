
export default function DocumentEditorCreateInfo(context) {
    let info = Promise.resolve('');

    switch (context.binding['@odata.type']) {
        case '#sap_mobile.MyWorkOrderDocument':
            info = context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=WOOperation_Nav,WOHeader').then(result => {
                let entity = result.getItem(0);
                if (entity.WOOperation_Nav) {
                    return {
                        entitySet: 'MyWorkOrderDocuments',
                        parentEntitySet: 'MyWorkOrderOperations',
                        parentProperty: 'WOOperation_Nav',
                        parentReadLink: `MyWorkOrderOperations(OrderId='${entity.WOOperation_Nav.OrderId}',OperationNo='${entity.WOOperation_Nav.OperationNo}')`,
                        objectKey: context.binding.ObjectKey,
                    };
                }
                return {
                    entitySet: 'MyWorkOrderDocuments',
                    parentEntitySet: 'MyWorkOrderHeaders',
                    parentProperty: 'WOHeader',
                    parentReadLink: `MyWorkOrderHeaders('${entity.OrderId}')`,
                    objectKey: context.binding.OrderId,
                };
            });
            break;
        case '#sap_mobile.MyNotifDocument':
            info = Promise.resolve({
                entitySet: 'MyNotifDocuments',
                parentEntitySet: 'MyNotificationHeaders',
                parentProperty: 'NotifHeader',
                parentReadLink: `MyNotificationHeaders('${context.binding.NotificationNumber}')`,
                objectKey: context.binding.NotificationNumber,
            });
            break;
        case '#sap_mobile.MyFuncLocDocument':
            info = Promise.resolve({
                entitySet: 'MyFuncLocDocuments',
                parentEntitySet: 'MyFunctionalLocations',
                parentProperty: 'FunctionalLocation',
                parentReadLink: `MyFunctionalLocations('${context.binding.FuncLocIdIntern}')`,
                objectKey: context.binding.FuncLocIdIntern,
            });
            break;
        case '#sap_mobile.MyEquipDocument':
            info = Promise.resolve({
                entitySet: 'MyEquipDocuments',
                parentEntitySet: 'MyEquipments',
                parentProperty: 'Equipment',
                parentReadLink: `MyEquipments('${context.binding.EquipId}')`,
                objectKey: context.binding.EquipId,
            });
            break;
        case '#sap_mobile.S4ServiceOrderDocument':
            info = context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=S4ServiceOrder_Nav').then(result => {
                let entity = result.getItem(0);
                return {
                    entitySet: 'S4ServiceOrderDocuments',
                    parentEntitySet: 'S4ServiceOrders',
                    parentProperty: 'S4ServiceOrder_Nav',
                    parentReadLink: `S4ServiceOrders(ObjectID='${entity.S4ServiceOrder_Nav.ObjectID}',ObjectType='${entity.S4ServiceOrder_Nav.ObjectType}')`,
                    objectKey: context.binding.ObjectKey,
                };
            });
            break;
        case '#sap_mobile.InspectionLotDocument':
            info = Promise.resolve({
                entitySet: 'InspectionLotDocuments',
                parentEntitySet: 'InspectionLots',
                parentProperty: 'InspectionLot_Nav',
                parentReadLink: `InspectionLots('${context.binding.InspectionLot}')`,
                objectKey: context.binding.InspectionLot,
            });
            break;
        case '#sap_mobile.WCMDocumentItemAttachment':
            info = Promise.resolve({
                entitySet: 'WCMDocumentItemAttachments',
                parentEntitySet: 'WCMDocumentItems',
                parentProperty: 'WCMDocumentItems',
                parentReadLink: `WCMDocumentItems(WCMDocument='${context.binding.WCMDocument}',WCMDocumentItem='${context.binding.WCMDocumentItem}')`,
                objectKey: context.binding.ObjectKey,
            });
            break;
        case '#sap_mobile.WCMDocumentHeaderAttachment':
            info = Promise.resolve({
                entitySet: 'WCMDocumentHeaderAttachments',
                parentEntitySet: 'WCMDocumentHeaders',
                parentProperty: 'WCMDocumentHeaders',
                parentReadLink: `WCMDocumentHeaders('${context.binding.WCMDocument}')`,
                objectKey: context.binding.ObjectKey,
            });
            break;
        case '#sap_mobile.WCMApplicationAttachment':
            info = Promise.resolve({
                entitySet: 'WCMApplicationAttachments',
                parentEntitySet: 'WCMApplications',
                parentProperty: 'WCMApplications',
                parentReadLink: `WCMApplications('${context.binding.WCMApplication}')`,
                objectKey: context.binding.ObjectKey,
            });
            break;
        case '#sap_mobile.WCMApprovalAttachment':
            info = Promise.resolve({
                entitySet: 'WCMApprovalAttachments',
                parentEntitySet: 'WCMApprovals',
                parentProperty: 'WCMApprovals',
                parentReadLink: `WCMApprovals('${context.binding.WCMApproval}')`,
                objectKey: context.binding.ObjectKey,
            });
            break;                      
        default:
            break;
    }
    return info;
}
