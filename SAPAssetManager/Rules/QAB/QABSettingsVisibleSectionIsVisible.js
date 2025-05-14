import { QABSettingsPage } from './QABSettings';

export default function QABSettingsVisibleSectionIsVisible(context) {
    return QABSettingsPage.isSectionVisible(context, QABSettingsPage.typeVisible);
}
