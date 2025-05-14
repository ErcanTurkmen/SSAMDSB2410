import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function PurchcaseRequisitionScreenSubmitActionName(context) {
    return CommonLibrary.IsOnCreate(context) ? context.localizeText('create') : context.localizeText('update');
}
