import { StorageLocationNotVisible } from './BulkUpdateLibrary';

export default function IsStorageLocationVisible(movementType = '', specialStockIndicator = '') {
    return !(StorageLocationNotVisible.MovementType.includes(movementType) || StorageLocationNotVisible.SpecialStockInd.includes(specialStockIndicator));
}
