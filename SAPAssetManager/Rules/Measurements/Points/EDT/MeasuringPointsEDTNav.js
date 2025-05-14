import MeasuringPointsEDTPageMetadataGenerator from './MeasuringPointsEDTPageMetadataGenerator';

export default async function MeasuringPointsEDTNav(context) {
    let pageMetadata = await MeasuringPointsEDTPageMetadataGenerator(context);
    let actionProperties = {
        'PageMetadata': pageMetadata,
        'PageToOpen': '/SAPAssetManager/Pages/GenericPage.page',
        'ModalPageFullscreen': true,
    };
    return context.getPageProxy().executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericNav.action',
        'Properties': actionProperties,
        'Type': 'Action.Type.Navigation',
    });
}
