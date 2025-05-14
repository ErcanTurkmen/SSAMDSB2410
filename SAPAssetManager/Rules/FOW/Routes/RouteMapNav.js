export default function RouteMapNav(context) {
    const pageProxy = context.getPageProxy();
    const binding = pageProxy.binding || context.binding;
    pageProxy.setActionBinding(binding.mapData);
    return context.executeAction('/SAPAssetManager/Actions/FOW/Routes/RouteMapNav.action');
}
