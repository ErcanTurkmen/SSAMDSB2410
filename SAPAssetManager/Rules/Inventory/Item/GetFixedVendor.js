import {ValueIfExists} from '../../Common/Library/Formatter';

export default function GetFixedVendor(context) {
    const binding = context.binding;
    if (binding && binding.FixedVendor) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'Vendors', [], `$filter=Vendor eq '${binding.FixedVendor}'`).then(result => {
            if (result.length > 0) {
                const vendor = result.getItem(0);
                return `${vendor.Vendor} - ${vendor.Name1}`;
            } else {
                return binding.FixedVendor;
            }
        });
    }
    return ValueIfExists(binding.FixedVendor);
}
