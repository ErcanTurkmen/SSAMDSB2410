import IsAndroid from '../../Common/IsAndroid';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/** @param {ISectionProxy} context  */
export default function IssuedApprovalIcons(context) {
    /** @type {WCMApprovalProcess} */
    const wcmApprovalProcess = context.binding;
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${wcmApprovalProcess['@odata.readLink']}/WCMApprovalProcessSegments`, [], '$filter=sap.islocal()').then(result => {
        if (ValidationLibrary.evalIsEmpty(result)) {
            return ['/SAPAssetManager/Images/approved.png'];
        }
        return ['/SAPAssetManager/Images/approved.png', IsAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png'];
    });
}
