import Logger from '../../Log/Logger';
import pageToolbar from './DetailsPageToolbarClass';
import ToolbarGetStatusOptions from './ToolbarGetStatusOptions';

export default function ToolbarRefresh(context, redraw = true) {
    //ObjectCardCollection does not have a toolbar
    if (!context.binding) {
        try {
            context.getPageProxy()?.getControls()[0].getSection('ObjectCard').redraw(true);
            return Promise.resolve();
        } catch (error) {
            Logger.error(error);
            return Promise.resolve();
        }
    }

    return ToolbarGetStatusOptions(context)
        .then(items => pageToolbar.getInstance().saveToolbarItems(context, items))
        .then(() => {
            if (redraw) {
                if (context.currentPage?.isModal()) {
                    const previousPageProxy = context.evaluateTargetPathForAPI('#Page:-Previous');
                    return redrawToolbar(previousPageProxy);
                }
                return redrawToolbar(context);
            }
            return Promise.resolve();
        })
        .catch(error => {
            Logger.error('Toolbar update', error);
            return Promise.resolve();
        });
}

export function redrawToolbar(context) {
    if (context?.getParent) {
        return context.getParent().reset();
    } else if (context?.getFioriToolbar?.()) {
        return context.getFioriToolbar().reset();
    }

    return Promise.resolve();
}
