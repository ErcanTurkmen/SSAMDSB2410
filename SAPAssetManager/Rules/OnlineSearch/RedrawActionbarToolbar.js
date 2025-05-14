import { redrawToolbar } from '../Common/DetailsPageToolbar/ToolbarRefresh';
import Logger from '../Log/Logger';

export default function RedrawActionbarToolbar(context) {
    const pageProxy = context.getPageProxy();
    const id = pageProxy.showActivityIndicator();
    try {
        return pageProxy._page._initializeActionBar().then(() => {
            pageProxy._page.androidSearchbarUISetupHelper(true);
            pageProxy._page._checkAndroidBackButton();
            pageProxy._page._enableHamburgerActionBarItem();
        }).then(() => {
            return redrawToolbar(pageProxy);
        }).finally(() => {
            pageProxy.dismissActivityIndicator(id);
        });
    } catch (err) {
        Logger.error('RedrawActionbarToolbar', err);
    }
}
