export default function GetAddress(context, addressNum) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Addresses', [], `$filter=AddressNum eq '${addressNum}'`).then(result => {
        if (result.length > 0) {
            return result.getItem(0);
        }
        return null;
    });
}
