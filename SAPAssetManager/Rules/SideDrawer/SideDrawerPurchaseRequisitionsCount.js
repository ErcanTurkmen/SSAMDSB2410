import libCom from '../Common/Library/CommonLibrary';

export default async function SideDrawerPurchaseRequisitionsCount(context) {
    const count = await libCom.getEntitySetCount(context, 'PurchaseRequisitionHeaders', '');

    return context.localizeText('purchase_requisitions_x', [count]);
}
