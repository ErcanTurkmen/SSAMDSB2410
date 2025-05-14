import { getPlantNameFL } from '../../Common/FLLibrary';
 
export function PackageHeaderPackagingDestPlant(context) {
    return getPlantNameFL(context, context.binding.PackagingDestPlant);
}
