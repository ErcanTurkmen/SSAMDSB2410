import DocumentsIsVisible from './DocumentsIsVisible';
import libEval from '../Common/Library/ValidationLibrary';

/**
+* Show/hide Add Attachment section depending on QM Notification Header/Item
+*/
export default function QMDefectDocumentsIsVisible(context) {
    if (DocumentsIsVisible(context)) {
        //Show Add Attachment control if notification doesn't exist for Inspection Lot
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [],
            `$filter=Items/any(itm: itm/InspectionChar_Nav/InspectionLot eq '${context.binding.InspectionLot}')`).then(result => {
                return libEval.evalIsEmpty(result);
            });
    }
    return false;
}
