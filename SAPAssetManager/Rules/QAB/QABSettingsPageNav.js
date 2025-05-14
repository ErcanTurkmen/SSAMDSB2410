import Logger from '../Log/Logger';

export default function QABSettingsPageNav(context) {       
    try {
        return context.getClientData().QABSettingsInstance.navToSettingsPage();
    } catch (err) {
        Logger.error('QABSettingsPageNav error', err);
    }
}
