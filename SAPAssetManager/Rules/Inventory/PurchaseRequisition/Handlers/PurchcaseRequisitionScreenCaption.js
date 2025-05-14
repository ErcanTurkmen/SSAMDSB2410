import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function PurchcaseRequisitionScreenCaption(context) {
    return CommonLibrary.IsOnCreate(context) ? context.localizeText('create_purchase_requisition') : context.localizeText('edit_purchase_requisition');
}
