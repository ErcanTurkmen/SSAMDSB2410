import libEval from '../../Common/Library/ValidationLibrary';

export function GetApprovalStatus(context) {
    /** returns the ApprovalStatus of the binding object's TrafficLight prop. must be equivalent to the calculated value from ApprovalProcessSegments  */
    return Promise.resolve(context.binding.TrafficLight.toString());
}

export function GetApprovalStatusFromProcesses(context) {
    /** returns the ApprovalStatus enum state of the binding object  */
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/WCMApprovalProcesses', [], '$expand=WCMApprovalProcessSegments($orderby=SegmentCounter desc;$top=1;$select=SegmentInactive)').then(approvalProcesses => { // expand the WCMApprovalProcessSegments, but get only the one with the highest SegmentCounter value
        const processCount = approvalProcesses.length;
        return Promise.all(approvalProcesses.map(p => IsProcessApproved(p))).then(results => {
            const approvedProcessCount = results.filter(isValid => isValid).length;

            return getApprovedStatus(context, processCount, approvedProcessCount);
        });
    });
}

export function IsProcessApproved(process) {
    /** returns whether the WCMApprovalProcess is Approved
     * a WCMApprovalProcess is approved if its WCMApprovalProcessSegment with the highest SegmentCounter is not SegmentInactive */
    if (libEval.evalIsEmpty(process.WCMApprovalProcessSegments)) {
        return false;
    }
    return !process.WCMApprovalProcessSegments[0].SegmentInactive;
}

export function getApprovedStatus(context, processCount, approvedProcessCount) {
    /** returns the ApprovalStatus enum value depending on the processCount and the approved count
     * if there isn't any not approved processes, then approved
     * if there are not-approved processes, but there is at least one approved, then partially aproved
     * if there are not-approved processes and there isn't any approved ones, then waiting for approval */
    if (processCount === approvedProcessCount) {
        return context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/Approved.global').getValue();
    } else if (0 < approvedProcessCount && approvedProcessCount < processCount) {
        return context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/PartiallyApproved.global').getValue();
    } else if (approvedProcessCount === 0) {
        return context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/WaitForApproval.global').getValue();
    }
    return undefined;
}
