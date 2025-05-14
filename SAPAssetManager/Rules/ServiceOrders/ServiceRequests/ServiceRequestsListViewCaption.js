
export default function ServiceResuestsListViewCaption(clientAPI, setCaption, query = '') {
    /** @type {IPageProxy} */
    const pageProxy = clientAPI.getPageProxy ? clientAPI.getPageProxy() : clientAPI;
    return Promise.all([
        clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceRequests', ''),
        clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceRequests', query),
    ]).then(([totalCount, count]) => {
        const pageTitle = count === totalCount ? clientAPI.localizeText('service_request_x', [totalCount]) : clientAPI.localizeText('service_request_x_x', [count, totalCount]);
        return setCaption ? pageProxy.setCaption(pageTitle) : pageTitle;
    });
}
