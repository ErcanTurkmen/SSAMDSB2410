import { QABSettingsPage } from './QABSettings';
import libVal from '../Common/Library/ValidationLibrary';

export default function QABSettingsSectionHeaderButtonEnabled(context) {
    // Get the section name from section header item
    // Sequence: SectionHeaderItem -> SectionHeader -> Section
    const sectionName = context.getParent().getParent().getName();

    return !libVal.evalIsEmpty(QABSettingsPage.getSectionItemsNames(context, sectionName));
}
