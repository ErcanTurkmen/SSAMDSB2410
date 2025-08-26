import { redrawToolbar } from '../Common/DetailsPageToolbar/ToolbarRefresh';
import Logger from '../Log/Logger';

export default function RedrawActionbarToolbar(context) {
    const pageProxy = context.getPageProxy();
    const id = pageProxy.showActivityIndicator();
    try {
        return pageProxy.getActionBar().reset()
            .then(() => redrawToolbar(pageProxy))
            .finally(() => pageProxy.dismissActivityIndicator(id));
    } catch (err) {
        Logger.error('RedrawActionbarToolbar', err);
        pageProxy.dismissActivityIndicator(id);
    }
}
