import Logger from '../../Log/Logger';

export default function ToolbarUpdateVisibility(clientApi, visibility) {
    let toolbarControl;
    let pageProxy = clientApi.getPageProxy();

    toolbarControl = pageProxy?.getToolbar?.() ?? pageProxy?.getFioriToolbar?.();

    if (toolbarControl) {
        try {
            toolbarControl.setVisible(visibility);
        } catch (error) {
            Logger.error('ToolbarUpdateVisibility', error);
        }
    }
}
