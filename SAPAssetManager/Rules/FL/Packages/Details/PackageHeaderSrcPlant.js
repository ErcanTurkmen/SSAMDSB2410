import { getPlantNameFL } from '../../Common/FLLibrary';
 
export function PackageHeaderSrcPlant(context) {
    return getPlantNameFL(context, context.binding.SourcePlant);
}
