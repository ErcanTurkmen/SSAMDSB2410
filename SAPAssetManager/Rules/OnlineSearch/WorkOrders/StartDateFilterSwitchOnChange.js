import RedrawFilterToolbar from '../../Filter/RedrawFilterToolbar';

export default function StartDateFilterSwitchOnChange(context) {
    const dateSwitch = context.evaluateTargetPath('#Page:OnlineSearchCriteriaWorkOrders/#Control:StartDateSwitch');
    const startControl = context.evaluateTargetPath('#Page:OnlineSearchCriteriaWorkOrders/#Control:StartDateFilter');
    const endControl = context.evaluateTargetPath('#Page:OnlineSearchCriteriaWorkOrders/#Control:EndDateFilter');

    startControl.setVisible(dateSwitch.getValue());
    endControl.setVisible(dateSwitch.getValue());
    startControl.redraw();
    endControl.redraw();

    // persist the date filter values
    let clientData = context.evaluateTargetPath('#Page:OnlineSearchCriteriaWorkOrders/#ClientData');
    clientData.StartDateSwitch = dateSwitch.getValue();
    RedrawFilterToolbar(context);
}
