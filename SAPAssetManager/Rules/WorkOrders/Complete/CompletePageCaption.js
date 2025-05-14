import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';

export default function CompletePageCaption(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);

    if (WorkOrderCompletionLibrary.getInstance().isWOFlow()) {
        return SupervisorLibrary.checkReviewRequired(context, binding).then((isReviewRequired) => { 
            if (isReviewRequired) {
                return context.localizeText('review_order');
            } else {
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=PlanningPlant eq '${binding.PlanningPlant}' and OrderType eq '${binding.OrderType}'`).then((result) => {
                    if (result.length > 0 && result.getItem(0).ServiceType === 'X') {
                        return context.localizeText('complete_order');
                    }
        
                    return context.localizeText('complete_work_order');
                });
            }
        });
    }

    if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow()) {
        return context.localizeText('complete_sub_operation');
    }

    if (WorkOrderCompletionLibrary.getInstance().isServiceOrderFlow()) {
        return SupervisorLibrary.checkReviewRequired(context, binding).then((isReviewRequired) => { 
            if (isReviewRequired) {
                return context.localizeText('review_service_order');
            } else {
                return context.localizeText('complete_service_order');
            }
        });
    }
    
    if (WorkOrderCompletionLibrary.getInstance().isServiceItemFlow()) {
        return context.localizeText('complete_service_item');
    }

    return SupervisorLibrary.checkReviewRequired(context, binding).then((isReviewRequired) => { 
        if (isReviewRequired) {
            return context.localizeText('review_operation');
        } else {
            return context.localizeText('complete_operation');
        }
    });
}
