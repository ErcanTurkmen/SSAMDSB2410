import libCom from '../Common/Library/CommonLibrary';

export default function DocumentEditorObjectLink(context) {
    let paramName = Promise.resolve('');
    switch (context.binding['@odata.type']) {
        case '#sap_mobile.MyWorkOrderDocument':
            paramName = context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=WOOperation_Nav,WOHeader').then(result => {
                let entity = result.getItem(0);
                if (entity.WOOperation_Nav) {
                    return 'WorkOrderOperation';
                }
                return 'WorkOrder';
            });
            break;
        case '#sap_mobile.MyNotifDocument':
            paramName = Promise.resolve('Notification');
            break;
        case '#sap_mobile.MyFuncLocDocument':
            paramName = Promise.resolve('FunctionalLocation');
            break;
        case '#sap_mobile.MyEquipDocument':
            paramName = Promise.resolve('Equipment');
            break;
        case '#sap_mobile.S4ServiceOrderDocument':
            paramName = Promise.resolve('ServiceOrder');
            break;
        case '#sap_mobile.InspectionLotDocument':
            paramName = Promise.resolve('InspectionLot');
            break;
        case '#sap_mobile.WCMDocumentItemAttachment':
            paramName = Promise.resolve('WCMDocumentItem');
            break;
        case '#sap_mobile.WCMDocumentHeaderAttachment':
            paramName = Promise.resolve('WCMDocumentHeader');
            break;
        case '#sap_mobile.WCMApplicationAttachment':
            paramName = Promise.resolve('WCMApplication');
            break;
        case '#sap_mobile.WCMApprovalAttachment':
            paramName = Promise.resolve('WCMApproval');
            break;  
        case '#sap_mobile.MyWorkOrderTool':
            paramName = Promise.resolve('WorkOrderTool');
            break;              
        default:
            break;
    }
    return paramName.then(type => {
        return libCom.getAppParam(context, 'DOCUMENT', type);
    });
}
