export default function ApprovalsSectionOnPress(context) {
    const pageProxy = context.getPageProxy();
    pageProxy.setActionBinding(pageProxy.binding);
    return pageProxy.executeAction('/SAPAssetManager/Actions/WCM/Approvals/ApprovalsListViewNav.action');
}
