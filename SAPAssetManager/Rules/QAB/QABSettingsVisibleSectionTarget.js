import { QABSettingsPage } from './QABSettings';

export default function QABSettingsVisibleSectionTarget(context) {
    return QABSettingsPage.getSectionTarget(context, QABSettingsPage.typeVisible);
}
