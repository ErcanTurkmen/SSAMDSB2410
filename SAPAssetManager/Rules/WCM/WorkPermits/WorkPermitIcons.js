import AttachedDocumentIcon from '../../Documents/AttachedDocumentIcon';
import TrafficLightStatusIcon from '../Common/TrafficLightStatusIcon';
import { GetApprovalStatus } from '../Common/GetApprovalStatus';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import DocumentsBDSCount from '../../Documents/Count/DocumentsBDSCount';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WorkPermitIcons(context) {
    return Promise.all([
        GetApprovalStatus(context),
        DocumentsBDSCount(context, context.binding),
        HasLocalApprovals(context, context.binding),
    ]).then(([status, docsCount, hasLocalApprovals]) => {
        const icons = [TrafficLightStatusIcon(context, status), AttachedDocumentIcon(context, undefined, docsCount), hasLocalApprovals ? CommonLibrary.GetSyncIcon(context) : undefined];
        return icons.filter(x => x !== undefined);
    });
}

/**
 * @param {ISectionProxy} context
 * @param {WCMApplication} workpermit
 */
export function HasLocalApprovals(context, workpermit) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${workpermit['@odata.readLink']}/WCMApprovalProcesses`, [], '$filter=WCMApprovalProcessSegments/any(seg: sap.islocal())').then(result => !ValidationLibrary.evalIsEmpty(result));

}
