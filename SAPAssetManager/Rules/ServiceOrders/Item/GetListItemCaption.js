
/**
 * @typedef ServiceItemsListViewPageClientData
 * @prop {string} filter
 * @prop {boolean} displayShortFastFilterItemList
 */


/**
 * @param {IPageProxy | ISectionedTableProxy} clientAPI
 * @param {string} queryOption
 */
export default function GetListItemCaption(clientAPI, queryOption = '', totalCountQueryOption = '') {
    /** @type {IPageProxy} */
    const pageProxy = clientAPI.getPageProxy ? clientAPI.getPageProxy() : clientAPI;
    return Promise.all([
        clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceItems', totalCountQueryOption),
        clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceItems', queryOption),
    ]).then(([totalCount, count]) => pageProxy.setCaption(count === totalCount ? clientAPI.localizeText('service_order_items_count_x', [totalCount]) : clientAPI.localizeText('service_order_items_count_x_x', [count, totalCount])));
}
