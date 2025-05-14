import { QABSettingsPage } from './QABSettings';

export default function QABSettingsSelectAllOnPress(context) {
    return QABSettingsPage.selectDeselectAllOnPress(context, QABSettingsPage.typeNonVisible);
}
