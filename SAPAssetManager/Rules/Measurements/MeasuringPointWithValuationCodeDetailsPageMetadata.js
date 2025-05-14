import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function MeasuringPointWithValuationCodeDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Measurements/MeasuringPointWithValuationCodeDetails.page');
    page = await ModifyKeyValueSection(clientAPI, page, 'MainKeyValueSection');
    if (clientAPI.getActionBinding() && clientAPI.getActionBinding().disableReading) {
        delete page.ToolBar;
    }

    return page;
}
