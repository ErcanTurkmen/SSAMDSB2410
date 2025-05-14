import libCom from '../Common/Library/CommonLibrary';
export default function BillOfLadingVisible(context) {
	return libCom.getStateVariable(context, 'IMObjectType') === 'PO';
}
