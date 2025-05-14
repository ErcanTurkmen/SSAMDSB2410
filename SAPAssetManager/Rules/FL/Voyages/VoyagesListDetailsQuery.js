/** @param {IClientAPI} context  */
export default function VoyagesListDetailsQuery(context)  {
    const pageProxy = context.getPageProxy();
    pageProxy.executeAction('/SAPAssetManager/Actions/FL/Voyages/VoyagesListViewNav.action');
}
