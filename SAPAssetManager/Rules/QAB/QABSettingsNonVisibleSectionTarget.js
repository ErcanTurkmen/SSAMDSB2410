import { QABSettingsPage } from './QABSettings';

export default function QABSettingsNonVisibleSectionTarget(context) {
    return QABSettingsPage.getSectionTarget(context, QABSettingsPage.typeNonVisible);
}
