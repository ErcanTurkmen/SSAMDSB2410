import { ValueResolver } from 'mdk-core/utils/ValueResolver';

/**
 * Return the image data string for the specified imageName
 * @param {*} context 
 * @param {*} imageName 
 * @returns 
 */
export default async function FSMSmartFormsSafetyLabelImagesWrapper(context, imageName) {
    if (imageName) {
        try {
            return ValueResolver.resolveValue('/SAPAssetManager/Images/Forms/' + imageName + '.png', context).then((result) => { //Get the image data from the definition
                return result;
            });
        } catch {
            return Promise.resolve('');
        }
    }
    return Promise.resolve('');
}
