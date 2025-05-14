import libCom from '../Common/Library/CommonLibrary';
export default function UnloadingPointGoodsRecipientDeliveryNoteVisible(context) {
	return ['IB','OB'].every((p) => p !== (libCom.getStateVariable(context, 'IMObjectType')));
}
