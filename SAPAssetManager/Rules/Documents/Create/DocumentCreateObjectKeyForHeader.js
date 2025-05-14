import CommonLib from '../../Common/Library/CommonLibrary';
import DocLib from '../DocumentLibrary';
export default function DocumentCreateObjectKeyForHeader(controlProxy) {

    const binding = CommonLib.getPageName(controlProxy) === 'PDFControl' ? CommonLib.getStateVariable(controlProxy, 'ServiceReportData') : controlProxy.binding;
    let value = binding['@odata.readLink'];
    switch (DocLib.getParentObjectType(controlProxy)) {
        case DocLib.ParentObjectType.WorkOrder:
            value += ':OrderId';
            break;
        case DocLib.ParentObjectType.MaterialDocument:
            value += ':MaterialDocNumber';
            break;
        case DocLib.ParentObjectType.MaterialDocItem:
            value = binding.TempHeader_MatDocReadLink + ':MaterialDocNumber';
            break;
        case DocLib.ParentObjectType.Notification:
            value += ':NotificationNumber';
            break;
        case DocLib.ParentObjectType.Equipment:
            value += ':EquipId';
            break;
        case DocLib.ParentObjectType.FunctionalLocation:
            value += ':FuncLocIdIntern';
            break;
        case DocLib.ParentObjectType.Operation:
            if (controlProxy.binding.OperationNo && controlProxy.binding.OperationNo[0] === 'L') {
                value += ':OperationNo';
                break;
            }
            return controlProxy.binding.ObjectKey;
        case DocLib.ParentObjectType.InspectionLot:
            if (binding['@odata.type'] === '#sap_mobile.InspectionLot') {
                value = binding['@odata.readLink'] + ':InspectionLot';
            } else if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                let lot = binding.InspectionLot;
                value = `InspectionLots('${lot}')` + ':InspectionLot';
            } else if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', `${binding.WOHeader['@odata.readLink']}/InspectionLot_Nav`, [], '').then(result => {
                    if (result && result.length > 0) {
                        return result.getItem(0)['@odata.readLink'] + ':InspectionLot';
                    }
                    return '';
                });
            } else {
                value = binding.InspectionLot_Nav['@odata.readLink'] + ':InspectionLot';
            }
            break;
        case DocLib.ParentObjectType.S4ServiceQuotationItem:
        case DocLib.ParentObjectType.S4ServiceItem:
        case DocLib.ParentObjectType.S4ServiceConfirmationItem:
            return binding.ItemGUID32;
        case DocLib.ParentObjectType.S4ServiceQuotation:
        case DocLib.ParentObjectType.S4ServiceOrder:
        case DocLib.ParentObjectType.S4ServiceConfirmation:
        case DocLib.ParentObjectType.S4ServiceRequest:
            value += ':ObjectID';
            break;
        case DocLib.ParentObjectType.WCMDocumentItem: {
            return binding.ObjectNumber;
        }    
        default:
            break;
    }
    return '<' + value + '>';
}
