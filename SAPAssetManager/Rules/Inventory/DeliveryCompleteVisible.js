import libCom from '../Common/Library/CommonLibrary';

export default function DeliveryCompleteVisible(context) {
	let type = libCom.getStateVariable(context, 'IMObjectType');
	return (type === 'PO' || type === 'STO' || type === 'RES' || type === 'PRD');
}
