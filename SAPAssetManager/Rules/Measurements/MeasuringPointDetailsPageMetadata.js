import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function MeasuringPointDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Measurements/MeasuringPointDetails.page');
    page = await ModifyKeyValueSection(clientAPI, page, 'MeasuringPointDetailsKeyValueSection');
    if (clientAPI.getActionBinding() && clientAPI.getActionBinding().disableReading) {
        delete page.ToolBar;
        delete page.ActionBar;
    }

    return page;
}
