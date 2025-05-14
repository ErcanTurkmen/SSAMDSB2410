import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetDocumentType(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'DocumentTypeLstPkr');
}
