import IsWONotificationVisible from '../../../../SAPAssetManager/Rules/WorkOrders/Complete/Notification/IsWONotificationVisible';
import WorkOrderCompletionLibrary from '../../../../SAPAssetManager/Rules/WorkOrders/Complete/WorkOrderCompletionLibrary';
import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import { ChecklistLibrary as libChecklist } from '../../../../SAPAssetManager/Rules/Checklists/ChecklistLibrary';
import SmartFormsCompletionLibrary from '../../../../SAPAssetManager/Rules/Forms/SmartFormsCompletionLibrary';
import FinalizeCompletePageMessage from '../../../../SAPAssetManager/Rules/WorkOrders/Complete/FinalizeCompletePageMessage';
import ZOperationComplete from '../../Operations/MobileStatus/ZOperationComplete';


export default function NavOnCompleteOperationPage(context, actionBinding) {
    let binding = actionBinding || context.getPageProxy().getActionBinding() || libCommon.getBindingObject(context);

    const equipment = binding.OperationEquipment;
    const functionalLocation = binding.OperationFunctionLocation;

    let expandOperationAction = Promise.resolve();
    if (binding && binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation' && !binding.WOHeader) {
        expandOperationAction = context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.editLink'], [], '$expand=WOHeader');
    }

    try {
        return expandOperationAction.then(function (result) {
            if (result && result.length > 0) {
                binding.WOHeader = result.getItem(0).WOHeader;
            }
            //Check for non-complete checklists and ask for confirmation    
            return libChecklist.allowWorkOrderComplete(context, equipment, functionalLocation).then(async results => {
                if (results === true) {
                    WorkOrderCompletionLibrary.getInstance().setCompletionFlow('operation');
                    await WorkOrderCompletionLibrary.getInstance().initSteps(context);
                    WorkOrderCompletionLibrary.getInstance().setBinding(context, binding);
                    await ZOperationComplete(context);
                    ///**  Start of DSB customization to handle operation completion
                    // return IsWONotificationVisible(context, binding.WOHeader, 'Notification').then((notification) => {
                    //     if (notification) {
                    //         WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                    //             visible: true,
                    //             data: JSON.stringify(notification),
                    //             link: notification['@odata.editLink'],
                    //             initialData: JSON.stringify(notification),
                    //         });
                    //     } else {
                    //         WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                    //             visible: false,
                    //         });
                    //     }

                    //     return SmartFormsCompletionLibrary.updateSmartformStep(context).then(() => {
                    //         WorkOrderCompletionLibrary.getInstance().setCompleteFlag(context, true);
                    //         let title = `${context.localizeText('completion_operation_title')}`;
                    //         let message = `${binding.OperationShortText} (${binding.OperationNo})`;
                    //         return showMessageDialog(context, title, message).then(
                    //             doMarkComplete => {
                    //                 if (doMarkComplete) {
                    //                     FinalizeCompletePageMessage(context);
                    //                 }
                    //                 else {
                    //                     return Promise.resolve(true);
                    //                 }
                    //             });
                    //         //return WorkOrderCompletionLibrary.getInstance().openMainPage(context, false);
                    //     });
                    // });

                    //End of DSB customization to handle operation completion */
                }
                return Promise.resolve();
            });
        });
    }
    catch (error) {
        context.dismissActivityIndicator();
        console.log('Issue in complete ', error);
    }
}

function showMessageDialog(context, title, message) {
    return context.executeAction(
        {
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties': {
                'Title': title,
                'Message': context.localizeText(message),
                'OKCaption': context.localizeText('ok'),
                'CancelCaption': context.localizeText('cancel'),
            },
        }).then(result => {
            return result.data;
        });
}