import libCom from '../Common/Library/CommonLibrary';
import { EditableAccountAssignments } from './Common/Library/InventoryLibrary';
import { isPurchaseOrderItem } from './Item/AcctAssgmtVisible';
export default function GLAccountVisible(context) {
	const move = libCom.getStateVariable(context, 'IMMovementType');
	if (move === 'R') {
		return true;
	}
	return context.binding && isPurchaseOrderItem(context.binding) && EditableAccountAssignments.includes(context.binding.AcctAssgmtCat);
}
