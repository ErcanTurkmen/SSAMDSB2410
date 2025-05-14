import libCom from '../../../Common/Library/CommonLibrary';

export default function IsDiscardButtonVisibleForPIItem(context) {
    const binding = context.binding.item || context.binding;
    if (libCom.isCurrentReadLinkLocal(binding['@odata.readLink'])) {  //Was this line item created locally on client?
         //Only local PI items can be discarded
        let query = "$filter=PhysInvDoc eq '" + binding.PhysInvDoc + "' and FiscalYear eq '" + binding.FiscalYear + "'";
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'PhysicalInventoryDocItems', query).then(function(count) { 
            return count > 1; //Can only delete if not the last item
        });        
    }
    return false;
}
