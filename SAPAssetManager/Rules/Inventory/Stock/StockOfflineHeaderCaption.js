import EnableInventoryClerk from '../../SideDrawer/EnableInventoryClerk';
import MaterialsSearchQueryOptions from './MaterialsSearchQueryOptions';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StockOfflineHeaderCaption(context) {
    const isInventoryClerk = EnableInventoryClerk(context);
    const sectionCaption = isInventoryClerk ? 'offline_stock_x' : 'offline_vehicle_stock_x';
    const queryString = MaterialsSearchQueryOptions(context);

    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs', queryString)
        .then(count => context.localizeText(sectionCaption, [count || 0]));
}
