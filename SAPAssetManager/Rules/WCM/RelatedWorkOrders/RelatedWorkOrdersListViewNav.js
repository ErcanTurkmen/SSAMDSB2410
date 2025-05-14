export default function RelatedWorkOrdersListViewNav(context) {
    context.getPageProxy().setActionBinding(context.getPageProxy().binding);
    return context.executeAction('/SAPAssetManager/Actions/WCM/RelatedWorkOrders/RelatedWorkOrdersListViewNav.action');
}
