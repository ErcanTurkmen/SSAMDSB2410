import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';
import SubServiceItemQueryOptions from './SubItem/SubServiceItemQueryOptions';

export default async function ServiceSubItemsObjectTableVisible(context) {
    if (PersonalizationPreferences.isServiceItemTableView(context)) {
        const itemsCount = await context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceItems', SubServiceItemQueryOptions(context.getPageProxy(), false, false));
        return itemsCount === 0;
    }

    return true;
}
