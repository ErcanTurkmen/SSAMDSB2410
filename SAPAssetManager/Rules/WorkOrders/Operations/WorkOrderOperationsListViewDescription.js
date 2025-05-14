
import WorkOrderOperationAssignedToListWrapper from '../../Supervisor/Assign/WorkOrderOperationAssignedToListWrapper';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import PhaseLibrary from '../../PhaseModel/PhaseLibrary';

export default function WorkOrderOperationsListViewDescription(context) {
    return WorkOrderOperationAssignedToListWrapper(context).then(assignee => {
        if (IsPhaseModelEnabled(context)) {
            let binding = context.getBindingObject();
            return PhaseLibrary.isPhaseModelActiveInDataObject(context, binding).then(isPhaseModelActive => {
                if (isPhaseModelActive) {
                    let descriptionFields = [assignee];

                    if (binding) {
                        // Excuation Stage
                        if (binding.OperationCategory) {
                            descriptionFields.push(binding.OperationCategory);
                        }
                        // Phase / Subphase Description
                        if (binding.OperationMobileStatus_Nav && binding.OperationMobileStatus_Nav.OverallStatusCfg_Nav) {
                            let status = binding.OperationMobileStatus_Nav.OverallStatusCfg_Nav;
                            if (status && status.PhaseDesc) {
                                descriptionFields.push(status.PhaseDesc);
                            } else if (binding.OperationMobileStatus_Nav?.PhaseDesc) { // Fallback to OperationMobileStatus_Nav.PhaseDesc only if OverallStatusCfg_Nav.PhaseDesc is not available
                                descriptionFields.push(binding.OperationMobileStatus_Nav.PhaseDesc);
                            }
                        }
                    }

                    return Promise.all(descriptionFields).then(fieldData => {
                        let result = '';
                        let i = 0; while (i < fieldData.length - 1) {
                            result += fieldData[i++] + '\n';
                        }
                        result += fieldData[i];
                        return result;
                    });
                }

                return assignee;
            });
        }

        return assignee;
    });
}
