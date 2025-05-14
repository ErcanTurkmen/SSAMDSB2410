import isAndroid from './IsAndroid';
import AttachedDocumentIcon from '../Documents/AttachedDocumentIcon';

export default function ListViewIconImages(controlProxy) {
    let iconImage = [];

    if (controlProxy.binding['@sap.hasPendingChanges']) {
        iconImage.push(isAndroid(controlProxy) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }
    if (controlProxy.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
         // check if this Equipment has any docs
         const docIcon = AttachedDocumentIcon(controlProxy, controlProxy.binding.EquipDocuments);
         if (docIcon) {
            iconImage.push(docIcon);
         }
    }
    return iconImage;
}
