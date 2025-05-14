import { MovementTypes, SpecialStock } from '../Common/Library/InventoryLibrary';
import { GetListPickerSelection } from './OnMovementTypeValueChanged';
import libCom from '../../Common/Library/CommonLibrary';
/**
 * @param {IListPickerFormCellProxy} context
*/
export default function SpecialStockListPickerDefaultItem(context) {
    
    if (context.binding) {
        let isLocal = libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        if (isLocal) {
            return context.binding.SpecialStockInd;
        }
        const selectedMovementType = getSelectedMovementType(context);
        return selectedMovementType === MovementTypes.t231 ? SpecialStock.OrdersOnHand : '';
    }
}

function getSelectedMovementType(context) {
    const fcContainer = context.getPageProxy().getControl('FormCellContainer');
    return fcContainer && fcContainer.getControl('MovementTypePicker') && GetListPickerSelection(fcContainer.getControl('MovementTypePicker'));
}

