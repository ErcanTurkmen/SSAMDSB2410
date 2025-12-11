
import libMobile from '../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import AttachedDocumentIcon from '../../../SAPAssetManager/Rules/Documents/AttachedDocumentIcon';
import CommonLibrary from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import ValidationLibrary from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import isAndroid from '../../../SAPAssetManager/Rules/Common/IsAndroid';

function hasLocalOperationLongText(/** @type {MyWorkOrderOperation?} */ operation) {
    return HasLocalArrayItem(operation?.OperationLongText);
}

function hasLocalTools(/** @type {MyWorkOrderOperation?} */ operation) {
    return HasLocalArrayItem(operation?.Tools);
}

function hasLocalComponents(/** @type {MyWorkOrderOperation?} */ operation) {
    return HasLocalArrayItem(operation?.Components);
}

/** @param {Array<{'@sap.isLocal': string?}>} arrayWithIslocalableItems  */
function HasLocalArrayItem(arrayWithIslocalableItems) {
    return !ValidationLibrary.evalIsEmpty(arrayWithIslocalableItems) && arrayWithIslocalableItems.some(item => !!item['@sap.isLocal']);
}

export default async function OperationsListViewIconImages(pageProxy) {
    const iconImage = [];
    const binding = pageProxy.binding;

    if (CommonLibrary.getTargetPathValue(pageProxy, '#Property:@sap.isLocal') ||
        CommonLibrary.getTargetPathValue(pageProxy, '#Property:OperationMobileStatus_Nav/#Property:@sap.isLocal') ||
        hasLocalOperationLongText(binding) ||
        hasLocalTools(binding) ||
        hasLocalComponents(binding)) {

        iconImage.push(CommonLibrary.GetSyncIcon(pageProxy));
    }

    // check if Operations has any attached documents
    const docIcon = AttachedDocumentIcon(pageProxy, binding.WOOprDocuments_Nav);
    if (docIcon) {
        iconImage.push(docIcon);
    }
    let isConfirmed;
    await libMobile.isMobileStatusConfirmed(pageProxy)
        .then(confirmed => isConfirmed = confirmed)
        .catch(() => '');

    if ((binding?.OperationNo && libMobile.isOperationStatusChangeable(pageProxy) && libMobile.getMobileStatus(binding, pageProxy) === 'COMPLETED') ||//check mobile status only if operation level assignment
        isConfirmed) { //check system status

        iconImage.push('/SAPAssetManager/Images/stepCheckmarkIcon.png');
    }

    // DSB customisation - check if Operations have PRT type equipment
    let prts = binding.Tools;
    if (prts && prts.length > 0) {
        //check to see if at least one of the documents has an associated document.
        let prtEquipExists = prts.some(prtequip => prtequip.PRTCategory === 'E');
        if (prtEquipExists) {
            if (isAndroid(pageProxy)) {
                iconImage.push('/SAPAssetManager/Images/orders.android.light.png');
            } else {
                iconImage.push('/SAPAssetManager/Images/orders.light.png');
            }
        }
    }
    return iconImage;
}
