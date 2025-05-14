import libCom from '../../Common/Library/CommonLibrary';

export default function OutboundNavWrapper(context) {
libCom.setStateVariable(context, 'IMObjectType', 'OB'); //PO/STO/RES/IB/OUT/ADHOC
libCom.setStateVariable(context, 'IMMovementType', 'I'); //I/R
return context.executeAction('/SAPAssetManager/Actions/Inventory/OutboundDelivery/InboundOutboundCreateUpdateNav.action');
}
