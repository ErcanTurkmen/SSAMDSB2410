import libForm from '../Common/Library/FormatLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import { IsBindingObjectOnline } from '../WorkOrders/IsBindingObjectOnline';

export default function OperationHeaderFunctionalLocationDescription(context) {
    const binding = context.binding;
    if (binding.OperationFunctionLocation) {
        const filter = `$filter=FuncLocId eq '${binding.OperationFunctionLocation}' or FuncLocIdIntern eq '${binding.OperationFunctionLocation}'`;
        if (IsBindingObjectOnline(context)) {
            return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'FunctionalLocations', ['FuncLocDesc', 'FuncLocId'], filter).then(function(result) {
                const floc = result.getItem(0);
                if (!libVal.evalIsEmpty(floc)) {
                    return libForm.getFormattedKeyDescriptionPair(context, floc.FuncLocId, floc.FuncLocDesc);
                }
    
                return '';
            });
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', ['FuncLocDesc', 'FuncLocId'], filter).then(function(result) {
            const floc = result.getItem(0);
            if (!libVal.evalIsEmpty(floc)) {
                return libForm.getFormattedKeyDescriptionPair(context, floc.FuncLocId, floc.FuncLocDesc);
            }

            return '';
        });
    } else {
        return '';
    }
}
