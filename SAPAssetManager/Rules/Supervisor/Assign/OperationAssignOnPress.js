import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import unassignOperation from '../UnAssign/OperationUnAssignChangeSet';
import { WorkOrderOperationDetailsPageNameToOpen } from '../../WorkOrders/Operations/Details/WorkOrderOperationDetailsPageToOpen';

export default function OperationAssignOnPress(context) {
    try {
        const IsUnAssign = libCom.getStateVariable(context, 'IsUnAssign');
        const IsReAssign = libCom.getStateVariable(context, 'IsReAssign');
        const IsAssign = libCom.getStateVariable(context, 'IsAssign');

        if (!libVal.evalIsEmpty(IsUnAssign) && IsUnAssign) {
            return unassignOperation(context).then(() => {
                return rebindObject(context).then(() => {
                    libAutoSync.autoSyncOnStatusChange(context);
                });
            });
        } else if (!libVal.evalIsEmpty(IsAssign) && IsAssign) {
            return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignPageRequiredFields.action').then(() => {
                return rebindObject(context).then(() => {
                    libAutoSync.autoSyncOnStatusChange(context);
                });
            });
        } else if (!libVal.evalIsEmpty(IsReAssign) && IsReAssign) {
            return context.executeAction('/SAPAssetManager/Actions/Supervisor/ReAssign/OperationReAssignPageRequiredFields.action').then(() => {
                return rebindObject(context).then(() => {
                    libAutoSync.autoSyncOnStatusChange(context);
                });
            });
        }
        return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignPageRequiredFields.action');
    } catch (error) {
        return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignPageRequiredFields.action');
    }
}

//Reload and rebind the operation details screen to refresh the assignee on screen
function rebindObject(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Employee_Nav', [], '').then(function(results) {        
        let page = context.evaluateTargetPathForAPI(`#Page:${WorkOrderOperationDetailsPageNameToOpen(context)}`);
        if (page) {
            if (results && results.length > 0) {
                page.getControl('SectionedTable')._context.binding.Employee_Nav = results.getItem(0);
            } else {
                delete page.getControl('SectionedTable')._context.binding.Employee_Nav; //Unassigned
            }
            page.getControl('SectionedTable').redraw();
            return Promise.resolve();
        }
        return Promise.resolve();
    });
}
