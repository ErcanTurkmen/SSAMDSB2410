import SubServiceItemQueryOptions from './SubServiceItemQueryOptions';

export default function SubServiceItemByItemCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceItems', SubServiceItemQueryOptions(context.getPageProxy(), false, false));
}
