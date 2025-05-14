import SupervisorLibrary from '../SupervisorLibrary';

export default function RejectReasonFieldName(context) {
    return SupervisorLibrary.isUserSupervisor(context).then(isSupervisor => {
        return isSupervisor ? '$(L,disapproval_reason)' : '$(L,reject_reason)';
    });
}
