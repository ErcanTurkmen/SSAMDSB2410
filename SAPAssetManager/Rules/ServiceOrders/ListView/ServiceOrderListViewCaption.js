
/**
 * @param {ISectionedTableProxy | IPageProxy} context
 * @param {DataQueryBuilder | string} queryOption
 */
export default function ServiceOrderListViewCaption(context, queryOption = '', totalCountQueryOption = '') {
    /** @type {IPageProxy} */
    const pageProxy = context.getPageProxy ? context.getPageProxy() : context;
    return Promise.all([
        context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceOrders', totalCountQueryOption),
        context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceOrders', queryOption),
    ]).then(([totalCount, count]) => pageProxy.setCaption(count === totalCount ? context.localizeText('service_order_x', [totalCount]) : context.localizeText('service_order_x_x', [count, totalCount])));
}
