export default async function FormRunnerNav(context) {
    // do not load into a modal window
    if (!context.currentPage.isFullScreen()) {
        // close the modal
        const pageProxy = context.getPageProxy();
        const actionBinding = pageProxy.getActionBinding();
        await context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        context.currentPage.context.clientAPI.setActionBinding(actionBinding);
        return context.executeAction('/SAPAssetManager/Actions/Forms/SDF/FormRunnerNav.action');
    }
    
    return context.executeAction('/SAPAssetManager/Actions/Forms/SDF/FormRunnerNav.action');
}
