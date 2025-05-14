export default function WorkOrderFilterOnLoaded(context) {
    let clientData = context.evaluateTargetPath('#Page:OnlineSearchWorkOrdersList/#ClientData');

    if (clientData) {
        const startDateFilterControl = context.evaluateTargetPath('#Page:OnlineSearchCriteriaWorkOrders/#Control:StartDateFilter');
        const endDateFilterControl = context.evaluateTargetPath('#Page:OnlineSearchCriteriaWorkOrders/#Control:EndDateFilter');
        const switchControl = context.evaluateTargetPath('#Page:OnlineSearchCriteriaWorkOrders/#Control:StartDateSwitch');
        const assignedToSegments = context.evaluateTargetPath('#Page:OnlineSearchCriteriaWorkOrders/#Control:AssignFilterButtons');
        const assignedToPickerControl = context.evaluateTargetPath('#Page:OnlineSearchCriteriaWorkOrders/#Control:AssignedToPicker');
        const assignedToItems = clientData?.AssignFilterButtons?.filterItems || [];

        if (assignedToItems.length) {
            assignedToPickerControl.setVisible(assignedToItems[0] === 'assigned');
            assignedToSegments.setValue(assignedToItems);
        }

        if (clientData.StartDateSwitch !== undefined) {
            switchControl.setValue(clientData.StartDateSwitch);
            startDateFilterControl.setValue(clientData.StartDateFilter);
            endDateFilterControl.setValue(clientData.EndDateFilter);
            startDateFilterControl.setVisible(clientData.StartDateSwitch);
            endDateFilterControl.setVisible(clientData.StartDateSwitch);
        }
    }
}
