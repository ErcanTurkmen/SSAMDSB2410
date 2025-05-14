export default function SideDrawerServiceRequestsCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceRequests')
        .then(count => {
            return context.localizeText('service_requests_x', [count]);
        })
        .catch(() => {
            return context.localizeText('service_requests_x', [0]);
        });
}
