import itemsContextStateVariablesSet from './ItemsContextStateVariablesSet';
import libCom from '../../Common/Library/CommonLibrary';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';
import { MovementTypes } from '../Common/Library/InventoryLibrary';

export default function OpenMaterialDocumentItemsScreen(context) {
    let binding = context.binding;
    let docBinding = context.binding;
    if (!binding) {
        return false;
    }
    if (!binding.MovementType) {
        binding = binding.RelatedItem[0];
    } else {
        docBinding = binding.AssociatedMaterialDoc;
    }
    if (libCom.getPreviousPageName(context) === 'MaterialDocumentRecentList' || libCom.getPreviousPageName(context) === 'MaterialDocumentDetailsIMPage' && EnableMultipleTechnician(context)) {
        libCom.setOnCreateUpdateFlag(context, 'CREATE');
        libCom.setStateVariable(context, 'TempLine_MatDocItemReadLink', '');
        libCom.setStateVariable(context, 'IMObjectType', 'ADHOC');
        libCom.setStateVariable(context, 'IMMovementType', 'I');
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/VehicleIssueOrReceiptCreateChangeset.action');
    }
    let type = '';
    switch (binding.MovementType) {
        case MovementTypes.t501:
        case MovementTypes.t502:
            type = 'R';
            break;
        case MovementTypes.t301:
        case MovementTypes.t303:
        case MovementTypes.t305:
        case MovementTypes.t311:
        case MovementTypes.t313:
        case MovementTypes.t315:
        case MovementTypes.t321:
        case MovementTypes.t322:
        case MovementTypes.t343:
        case MovementTypes.t411:
            type = 'T';
            break;
        case MovementTypes.t201:
        case MovementTypes.t202:
        case MovementTypes.t221:
        case MovementTypes.t222:
        case MovementTypes.t231:
        case MovementTypes.t261:
        case MovementTypes.t262:
        case MovementTypes.t281:
        case MovementTypes.t282:
        case MovementTypes.t551:
        case MovementTypes.t552:
        case MovementTypes.t553:
        case MovementTypes.t555:
            type = 'I';
            break;
        default:
    }
    if (type) {
        libCom.setStateVariable(context, 'IMObjectType', 'ADHOC');
        libCom.setStateVariable(context, 'IMMovementType', type);
        libCom.setStateVariable(context, 'IsAlreadyCreatedDoc', true);
        libCom.setStateVariable(context, 'ActualDocId', binding.MaterialDocNumber);
        let fixedData = {
            headerNote: docBinding.HeaderText,
            postingDate: docBinding.PostingDate,
            order: binding.OrderNumber,
            salesorder: binding.SalesOrderNumber,
            network: binding.Network,
            cost_center: binding.CostCenter,
            project: binding.WBSElement,
        };
        libCom.setStateVariable(context, 'FixedData', fixedData);
        let params = {
            MovementType: binding.MovementType,
            StorageLocation: binding.StorageLocation,
            Plant: binding.Plant,
            OrderNumber: binding.OrderNumber,
        };
        return itemsContextStateVariablesSet(context, binding.MaterialDocNumber, params).then(() => {
            context.getPageProxy().setActionBinding('');
            return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentModalListNav.action');
        });
    }
    return true;
}
