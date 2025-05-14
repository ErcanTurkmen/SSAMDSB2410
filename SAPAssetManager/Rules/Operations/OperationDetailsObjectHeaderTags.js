import OperationMobileStatus from '../MobileStatus/OperationMobileStatus';
import libClock from '../ClockInClockOut/ClockInClockOutLibrary';
import libCom from '../Common/Library/CommonLibrary';
import PhaseLibrary from '../PhaseModel/PhaseLibrary';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';

export default function OperationDetailsObjectHeaderTags(context) {
    let tags = [];
    let status = OperationMobileStatus(context);
    let woStarted = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

    return libClock.reloadUserTimeEntries(context).then(() => {
        if (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, status)) { //Clock in/out feature enabled and user is clocked in to this operation, regardless of mobile status
            status = context.localizeText(woStarted) + '-' + context.localizeText('clocked_in');
        }

        let binding = context.getBindingObject();
        tags.push(binding.ControlKey);

        return PhaseLibrary.isPhaseModelActiveInDataObject(context, binding).then(isPhaseModelActive => {
            if (isPhaseModelActive) {   
                let statusConfig = getStatusConfig(binding);

                if (statusConfig.PhaseDesc) {
                    tags.push(status + ' (' + statusConfig.PhaseDesc + ')');
                } else {
                    tags.push(status);
                }

                if (statusConfig.Subphase && statusConfig.SubphaseDesc) {
                    tags.push(statusConfig.SubphaseDesc + ' (' + statusConfig.Subphase + ')');
                } else if (statusConfig.SubphaseDesc) {
                    tags.push(statusConfig.SubphaseDesc);
                }
            } else {
                tags.push(status);
            }

            return tags;
        }).catch(() => {
            return tags;
        });
    }).then((result) => {
        return libWO.addTagsForWCMAndCreatedWorkOrder(context, result);
    });
}

function getStatusConfig(binding) {
    return binding.OperationMobileStatus_Nav ? binding.OperationMobileStatus_Nav.OverallStatusCfg_Nav : {};
}
