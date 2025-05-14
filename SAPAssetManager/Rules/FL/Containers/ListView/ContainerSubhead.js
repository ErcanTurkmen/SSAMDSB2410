/**
* @param {IClientAPI} clientAPI
*/
export default function ContainerSubhead(clientAPI) {
    const binding = clientAPI.binding;
    return [binding.VoyageNumber, binding.ShippingPoint, binding.SupplierNo].filter(i => !!i).join(', ');
}
