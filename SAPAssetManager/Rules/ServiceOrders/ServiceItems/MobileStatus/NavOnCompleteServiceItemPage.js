import CommonLibrary from '../../../Common/Library/CommonLibrary';
import SmartFormsCompletionLibrary from '../../../Forms/SmartFormsCompletionLibrary';
import WorkOrderCompletionLibrary from '../../../WorkOrders/Complete/WorkOrderCompletionLibrary';

export default async function NavOnCompleteServiceItemPage(context, actionBinding) {
    let binding = actionBinding || context.getPageProxy().getActionBinding() || CommonLibrary.getBindingObject(context);

    WorkOrderCompletionLibrary.getInstance().setCompletionFlow('service_item');
    await WorkOrderCompletionLibrary.getInstance().initSteps(context);
    WorkOrderCompletionLibrary.getInstance().setBinding(context, binding);
    WorkOrderCompletionLibrary.getInstance().setCompleteFlag(context, true);

    return SmartFormsCompletionLibrary.updateSmartformStep(context).then(() => {
        return WorkOrderCompletionLibrary.getInstance().openMainPage(context, false);
    });
}
