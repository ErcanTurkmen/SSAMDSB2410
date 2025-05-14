import CommonLibrary from '../../Common/Library/CommonLibrary';

/** @param {IFormCellProxy} context  */
export default function AssignSegmentChange(context) {
    const switcher = context.evaluateTargetPath('#Page:OnlineSearchCriteriaWorkOrders/#Control:AssignFilterButtons');
    const assignPicker = context.evaluateTargetPath('#Page:OnlineSearchCriteriaWorkOrders/#Control:AssignedToPicker');
    const assignedToValues = CommonLibrary.getControlValue(switcher) || [];
    const isAssignedSelected = assignedToValues.length ? assignedToValues[0] === 'assigned' : false;
    if (!assignedToValues.length) {
        assignPicker.setValue(undefined);
    }
    assignPicker.setVisible(isAssignedSelected);
}
