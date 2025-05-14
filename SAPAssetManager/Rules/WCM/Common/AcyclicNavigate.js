import CommonLibrary from '../../Common/Library/CommonLibrary';

export function AcyclicNavigate(context, targetPageName, navAction, equalityComparer, lookBehindDepth = 2) {
    const pageProxy = context.getPageProxy();
    if (!pageProxy._page.frame.backStack.map(backstackEntry => backstackEntry.resolvedPage.definition.name).includes(targetPageName)) {  // no chance of having the page with the correct binding in the history
        return context.executeAction(navAction);
    }
    const targetSelectedItem = pageProxy.getActionBinding();
    let previousPage = GetPreviousPage(pageProxy);
    for (const depth of [...Array(lookBehindDepth).keys()]) {
        if (previousPage === undefined) {  // we probably reached the end of the page-history
            break;
        }
        if (previousPage && targetSelectedItem && CommonLibrary.getPageName(previousPage) === targetPageName && equalityComparer(previousPage.getBindingObject(), targetSelectedItem)) {
            return CloseNPages(context, depth + 1);
        }
        previousPage = GetPreviousPage(previousPage);
    }
    return context.executeAction(navAction);
}

function CloseNPages(context, n) {
    return [...Array(n).keys()]  // close as many pages, as deep we found the target page in the page-history
        // eslint-disable-next-line no-unused-vars
        .reduce((promiseChain, _) => promiseChain.then(() => context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action')), Promise.resolve());
}

function GetPreviousPage(context) {
    try {
        return context._page.getBackStackCount() < 2 ? undefined : context.evaluateTargetPathForAPI('#Page:-Previous');  // expected to have at least overview-page + detail-page or list-page + detail-page in the history
    } catch (err) {  // expect a no previous page exception
        return undefined;
    }
}
