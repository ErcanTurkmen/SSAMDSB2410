
import libMobile from '../MobileStatus/MobileStatusLibrary';
import AttachedDocumentIcon from '../Documents/AttachedDocumentIcon';
import CommonLibrary from '../Common/Library/CommonLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';

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

    return iconImage;
}
