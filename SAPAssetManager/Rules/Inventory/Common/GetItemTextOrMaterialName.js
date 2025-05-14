import libComm from '../../Common/Library/CommonLibrary';
import GetMaterialName from './GetMaterialName';

/**
 * This function returns the "Material Number - Material Description"
 * If the ItemText or Item Descript is blank, then 
 * return the material description of the MaterialNum property.
 */
export default function GetItemTextOrMaterialName(context, bindingObject = undefined) {
    const binding = bindingObject || context.binding;
    if (!libComm.isDefined(binding)) {
        return '';
    }

    const material = libComm.isDefined(binding.Material) ? binding.Material : binding.MaterialNum;
    const itemText = libComm.isDefined(binding.ItemText) ? binding.ItemText : binding.ItemDescript;

    if (libComm.isDefined(material)) {
        return libComm.isDefined(itemText)
            ? Promise.resolve(`${material} - ${itemText}`)
            : GetMaterialName(context, binding).then(name => `${material} - ${name}`);
    } else {
        return Promise.resolve(itemText || '');
    }
}
