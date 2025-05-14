import { getPlantNameFL } from '../../Common/FLLibrary';
 
export function PackageHeaderPackagingSrcPlant(context) {
    return getPlantNameFL(context, context.binding.PackagingSourcePlant);
}
