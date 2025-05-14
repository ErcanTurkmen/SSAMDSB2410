import Logger from '../../Log/Logger';
import { PI_COUNTED_FILTER } from '../../Inventory/PhysicalInventory/PhysicalInventoryCountNavWrapper';

/**
* This function gives the Physical inventory count status...
* @param {IClientAPI} context
*/
export default function GetCountStatusForInventoryHeader(context) {
    const binding = context.binding;
    const target = binding['@odata.readLink'];

    const countEntity = target + '/PhysicalInventoryDocItem_Nav';
    const totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', countEntity, '');
    const countedPromise = context.count('/SAPAssetManager/Services/AssetManager.service', countEntity, '$filter=' + PI_COUNTED_FILTER);

    return Promise.all([totalCountPromise, countedPromise]).then(([totalCount, count])=> {       
        if (count === totalCount) {
          return context.localizeText('pi_counted');
        } else if (count > 0) {
          return context.localizeText('pi_partially_counted');
        } else if (count === 0) {
           return context.localizeText('pi_uncounted');
        }
        return '';
    }).catch((error) => {
      Logger.error('Physical Inventory',  error);
      return '';
  });
}
