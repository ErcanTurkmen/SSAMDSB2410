import { PI_COUNTED_FILTER } from '../../Inventory/PhysicalInventory/PhysicalInventoryCountNavWrapper';

export default function PhysicalInventoryDocCountTotals(context, readLink, status = false) {

    const binding = context.binding;
    let target = binding['@odata.readLink'];

    if (readLink) {
        target = readLink;
    }

    const countEntity = target + '/PhysicalInventoryDocItem_Nav';
    const totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', countEntity, '');
    const countedPromise = context.count('/SAPAssetManager/Services/AssetManager.service', countEntity,'$filter=' + PI_COUNTED_FILTER);

    return Promise.all([totalCountPromise, countedPromise]).then(function(counts) {
        const totalCount = counts[0];
        const count = counts[1];
        const params = [];

        params.push(count);
        params.push(totalCount);

        if (status) { //Return the status only instead of formatted count totals (tag on PI details)
            if (count === totalCount) {
                return context.localizeText('pi_counted');
            } else if (count > 0) {
                return context.localizeText('pi_partially_counted');
            } else if (count === 0) {
                return context.localizeText('pi_uncounted');
            }
            return '';
        }
       
        return context.localizeText('pi_counted_of_total', params);
    });
}
