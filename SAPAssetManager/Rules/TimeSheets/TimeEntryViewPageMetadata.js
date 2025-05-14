import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function TimeEntryViewPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/TimeSheets/TimeEntryView.page');
    return await ModifyKeyValueSection(clientAPI, page, 'TimeEntryDetailsSection');
}
