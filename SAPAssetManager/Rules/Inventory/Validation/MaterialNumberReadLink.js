import libVal from '../../Common/Library/ValidationLibrary';

export default function MaterialNumberReadLink(context) {
    let material = '';
    let plant = '';
    if (!libVal.evalIsEmpty(context.binding) && !libVal.evalIsEmpty(context.binding.RelatedItem)) {
        plant = context.binding.RelatedItem[0].Plant;
        material = context.binding.RelatedItem[0].Material;
    } else if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.MaterialDocItem') {
        plant = context.binding.Plant;
        material = context.binding.Material;
    }
    if (!libVal.evalIsEmpty(material) && !libVal.evalIsEmpty(plant)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `MaterialPlants(Plant='${plant}',MaterialNum='${material}')`, [], '').then(result => {
            return getResult(result);
        });
    }
    return '';
}

function getResult(result) {
    if (result.length > 0) {
        return result.getItem(0)['@odata.readLink'];
    }
    return '';
}
