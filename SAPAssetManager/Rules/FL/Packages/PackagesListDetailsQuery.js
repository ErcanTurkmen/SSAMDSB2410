/** @param {IClientAPI} context  */
export default function PackagesListDetailsQuery(context)  {
    context.getPageProxy().executeAction('/SAPAssetManager/Actions/FL/Packages/PackagesListViewNav.action');
}
