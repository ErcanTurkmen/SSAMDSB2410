import IsStorageLocationVisible from '../IsStorageLocationVisible';
import IsStorageLocationVisibleForMaterial from '../../../Validation/IsStorageLocationVisible';

export default async function IsStorageLocationReadOnly(context, bindingObject = undefined) {
    const binding = bindingObject || context.binding;
    return !(IsStorageLocationVisible(binding.MovementType, binding.SpecialStockInd) && await IsStorageLocationVisibleForMaterial(context, binding));
}
