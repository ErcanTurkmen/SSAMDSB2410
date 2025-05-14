/**
* Describe this function...
* @param {IClientAPI} context
*/
import GetMaterialName from '../Common/GetMaterialName';
export default function GetMaterial(context) {
    return GetMaterialName(context).then(name => `${context.binding.Material} - ${name}`);
}
