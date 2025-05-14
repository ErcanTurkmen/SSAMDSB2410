import { QABSettingsPage } from './QABSettings';    

export default function QABSettingsNonVisibleSectionIsVisible(context) {
    return QABSettingsPage.isSectionVisible(context, QABSettingsPage.typeNonVisible);
}
