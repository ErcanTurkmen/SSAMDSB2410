import libCom from '../../Common/Library/CommonLibrary';

export default function InboundNavWrapper(context) {
    libCom.setStateVariable(context, 'IMObjectType', 'IB'); //PO/STO/RES/IB/OUT/ADHOC
    libCom.setStateVariable(context, 'IMMovementType', 'R'); //I/R
    return context.executeAction('/SAPAssetManager/Actions/Inventory/OutboundDelivery/InboundOutboundCreateUpdateNav.action');
}
