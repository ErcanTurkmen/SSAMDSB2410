/**
* decode confirmed and requested quantity
* @param {IClientAPI} context
*/
export default function DecodeRequestedQuantity(quantityString) {
    const matched = quantityString.match(/(\S*) \/ (\S*) (\S*)/);
    return matched ? matched.splice(1) : [0, 0, ''];
}
