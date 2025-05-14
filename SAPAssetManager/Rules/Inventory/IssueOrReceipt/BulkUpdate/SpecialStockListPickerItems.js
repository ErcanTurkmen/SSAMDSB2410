import GetDefaultMovementType from './GetMovementType';
import SpecialStockListPickerItems from '../SpecialStockListPickerItems';

export default async function GetSpecialStockListPickerItems(context, selectedMovementType = '') {
    if (!selectedMovementType) {
        selectedMovementType = await GetDefaultMovementType(context);
    }
    return SpecialStockListPickerItems(context, selectedMovementType);
}
