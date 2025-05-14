import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import DocumentCreateBDS from '../../Documents/Create/DocumentCreateBDS';
import InspectionPointsDynamicPageNav from '../../WorkOrders/Operations/InspectionPoints/InspectionPointsDynamicPageNav';

export default function InspectionCharacteristicsChangeSetOnSuccess(context) {

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive || context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsUpdateSuccess.action');
        });
    }

    let readlink = `InspectionLots('${context.binding.InspectionLot}')` + '/InspectionChars_Nav';
    let filter = "$filter=CharCategory eq 'X' and Valuation eq ''";

    if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        readlink = context.binding.InspectionPoint_Nav[0]['@odata.readLink'] + '/InspectionChars_Nav';
    } else if (context.binding['@odata.type'] === '#sap_mobile.InspectionPoint') {
        readlink = context.binding['@odata.readLink'] + '/InspectionChars_Nav';
    }

    const controls = context.getPageProxy().getControls()[0]._control.controls;
    const attachmentControl = controls[controls.length - 1].controlProxy; // attachment control is always the last one
    const docs = attachmentControl.getValue();
    const deletedAttachments = attachmentControl.getClientData().DeletedAttachments;

    let deletes = [];
    if (deletedAttachments && deletedAttachments.length > 0) {
        // create an rray with all the readLinks to process
        context.getClientData().DeletedDocReadLinks = deletedAttachments.map((deletedAttachment) => {
            return deletedAttachment.readLink;
        });

        deletes = deletedAttachments.map(() => {
            //call the delete doc delete action
            return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentDeleteBDS.action');
        });
    }

    libCom.setStateVariable(context, 'TransactionType', 'UPDATE');
    let notCreatedDocs = docs.filter(doc => !doc.readLink);
    let documentsCreatePromise = libCom.isDefined(notCreatedDocs) ? DocumentCreateBDS(context, notCreatedDocs) : Promise.resolve();

    return Promise.all(deletes).then(() => {
        return documentsCreatePromise.then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsUpdateSuccess.action').then(() => {
                    return context.count('/SAPAssetManager/Services/AssetManager.service', readlink, filter).then(function(count) {
                        if (count === 0) { //get the count for required Characteristics
                            //proceed to Inspection Points
                            if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
                                const woInfo = context.binding.WOHeader_Nav || context.binding.WOOperation_Nav?.WOHeader  || undefined;
                                if (!userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) || (woInfo && !woInfo.EAMChecklist_Nav.length > 0)) {
                                    return InspectionPointsDynamicPageNav(context);
                                }
                                if (libCom.getSetUsage(context)) {
                                    return executeUsageLot(context);
                                }
                                return Promise.resolve();
                            } else {
                                if (libCom.getSetUsage(context)) {
                                    return executeUsageLot(context);
                                } else {
                                    return Promise.resolve();
                                }
                            }
                        }
                        return false;
                    });
                });
            });
        });
    });
}

export function executeUsageLot(context) {
    if (libCom.getSetUsage(context) === 'Y') {
        let pageName = libCom.getStateVariable(context, 'FDCPreviousPage');
        let actionBinding = context.evaluateTargetPathForAPI('#Page:' + pageName).binding;
        if (context.evaluateTargetPathForAPI('#Page:' + pageName).getClientData().ActionBinding) {
            actionBinding = context.evaluateTargetPathForAPI('#Page:' + pageName).getClientData().ActionBinding;
        }
        if (actionBinding['@odata.type'] === '#sap_mobile.InspectionPoint' || actionBinding['@odata.type'] === '#sap_mobile.InspectionCharacteristic' || actionBinding['@odata.type'] === '#sap_mobile.EAMChecklistLink') {
            context.setActionBinding(actionBinding.InspectionLot_Nav);
        } else if (actionBinding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
            context.setActionBinding(actionBinding.InspectionPoint_Nav.InspectionLot_Nav);
        } else {
            context.setActionBinding(actionBinding);
        }
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/InspectionLot/InspectionLotSetUsageNav.action');
    } else {
        return Promise.resolve();
    }
}
