import {ValueIfExists} from '../../Common/Library/Formatter';

export default function GetDesiredVendor(context) {
    const binding = context.binding;
    if (binding && binding.DesiredVendor) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'Vendors', [], `$filter=Vendor eq '${binding.DesiredVendor}'`).then(result => {
            if (result.length > 0) {
                const vendor = result.getItem(0);
                return `${vendor.Vendor} - ${vendor.Name1}`;
            } else {
                return binding.DesiredVendor;
            }
        });
    }
    return ValueIfExists(binding.DesiredVendor);
}
