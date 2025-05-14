import AttachedDocumentIcon from '../../Documents/AttachedDocumentIcon';
import { GetApprovalStatus } from '../Common/GetApprovalStatus';
import TrafficLightStatusIcon from '../Common/TrafficLightStatusIcon';
import { HasLocalApprovals } from '../WorkPermits/WorkPermitIcons';
import DocumentsBDSCount from '../../Documents/Count/DocumentsBDSCount';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function SafetyCertificatesIcons(context) {
    return Promise.all([
        GetApprovalStatus(context),
        DocumentsBDSCount(context, context.binding),
        HasLocalApprovals(context, context.binding),
        HasLocalMobileStatus(context, context.binding),
    ]).then(([status, docsCount, hasLocalApprovals, hasLocalMobileStatus]) => {
        const icons = [TrafficLightStatusIcon(context, status), AttachedDocumentIcon(context, undefined, docsCount)];
        if (hasLocalApprovals || hasLocalMobileStatus) {
            icons.push(CommonLibrary.GetSyncIcon(context));
        }
        return icons.filter(x => x !== undefined);
    });
}

/**
 * @param {WCMDocumentHeader} cert
 * @returns {Promise<bool>} */
function HasLocalMobileStatus(context, cert) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${cert['@odata.readLink']}/PMMobileStatus`, [], '')
        .then((/** @type {ObservableArray<PMMobileStatus>} */ result) => !!(!ValidationLibrary.evalIsEmpty(result) && result.getItem(0)['@sap.hasPendingChanges']));
}
