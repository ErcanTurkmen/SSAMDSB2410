import { MovementTypes } from '../Common/Library/InventoryLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function GetMovementType(context) {
    let type;
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'PurchaseOrderItem') {
            return MovementTypes.t101;
        }
        // add pre-selected
        if (type === 'MaterialDocItem') {
            const movementType = context.binding.MovementType;
            if (!libVal.evalIsEmpty(movementType)) {
                if ([MovementTypes.t303, MovementTypes.t313].some(t => t === movementType)) {
                    // reverse 303=>304, 313=>314
                    return (Number(movementType) + 1).toString();
                }
            }
        }
    }
    return '';
}
