import libCom from '../Common/Library/CommonLibrary';

export default function HeaderTextVisible(context) {
	let type = libCom.getStateVariable(context, 'IMObjectType');
	return !(type === 'IB' || type === 'OB');
}
