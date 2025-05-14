
export default function ProgressTrackerOnDataChanged(context) {
    let pageProxy = context.getPageProxy();

    if (pageProxy && pageProxy.currentPage._id === pageProxy._page._id) {
        resetControl(pageProxy);
    } else if (pageProxy.currentPage.isModal()) {
        pageProxy = pageProxy.evaluateTargetPathForAPI('#Page:-Previous');
        resetControl(pageProxy);
    }

    return Promise.resolve();
}

function resetControl(pageProxy) {
    let extension = pageProxy.getControl('SectionedTable')
        .getControl('ProgressTrackerExtensionControl')?.getExtension();
    if (extension) {
        extension.reset();
    }
}
