import Logger from '../Log/Logger';
import libSearch from './OnlineSearchLibrary';

export default function SelectModeButtonVisible(context) {
    try {
        const pageProxy = libSearch.getCurrentTabPage(context);
        const listSection = pageProxy.getControls()[0].getSections()[0];

        // multi-select mode is disabled for 2410 release
        return false && listSection.getVisible() &&
            listSection._context.element.observable()._boundItems.length > 0 &&
            listSection.getSelectionMode() !== 'Multiple';
    } catch (err) {
        Logger.error('SelectModeButtonVisible', err);
        return false;
    }
}
