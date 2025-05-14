import { ValueIfExists } from '../../Common/Library/Formatter';

export default async function ServiceItemProductDescriptionValue(context) {
    const binding = context.getBindingObject();
    
    if (binding.Product_Nav) {
        return Promise.resolve(binding.Product_Nav.Description);
    }

    if (binding.ProductID) {
        const product = await context.read('/SAPAssetManager/Services/AssetManager.service', 'Materials', ['Description'], `$filter=MaterialNum eq '${binding.ProductID}'`).then(result => result.length ? result.getItem(0) : null);
        return ValueIfExists(product?.Description);
    }

    return Promise.resolve('-');
}
