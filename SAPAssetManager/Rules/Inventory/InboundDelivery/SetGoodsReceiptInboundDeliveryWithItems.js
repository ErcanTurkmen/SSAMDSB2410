import libCom from '../../Common/Library/CommonLibrary';
import InboundOrOutboundDeliveryUpdateWithItems from '../InboundOrOutbound/InboundOrOutboundDeliveryUpdateWithItems';

export default function SetGoodsReceiptInboundDeliveryWithItems(context) {
    libCom.setStateVariable(context, 'IMObjectType', 'IB'); //PO/STO/RES/IB/OUT/ADHOC
    libCom.setStateVariable(context, 'IMMovementType', 'R'); //I/R
    if (context.getPageProxy()?.getActionBinding()) {
        context._context.binding = context.getPageProxy().getActionBinding();
    }
    return InboundOrOutboundDeliveryUpdateWithItems(context);
}
