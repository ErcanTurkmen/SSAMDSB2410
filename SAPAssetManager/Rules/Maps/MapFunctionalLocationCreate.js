import FunctionalLocationAddTextButton from '../Common/ChangeSet/FunctionalLocationAddTextButton';

export default function MapFunctionalLocationCreate(context) {
    const extension = context.getControl('MapExtensionControl')._control;
    if (extension) {
        const json = {
            EditModeConfig: {
                EditModePanel: {
                    GeometryTypes: ['Polyline', 'Polygon'],
                    TitleText: 'action_create_floc',
                    SaveButtonText: FunctionalLocationAddTextButton(context),
                    Symbol: {
                        marker : 'MarkerFunctionalLocation',
                        styleWidth : 24,
                        styleHeight : 24,
                        lineColor : 'F58B00',
                        fillColor : 'F58B0033',
                        lineWidth : 2,
                        yOffset : 0,
                        xOffset : 0,
                    },
                },
                CallbackInfo: {
                    Action: '/SAPAssetManager/Rules/FunctionalLocation/CreateUpdate/FunctionalLocationCreateFromMap.js',
                    Target: {
                        EntitySet: 'MyFunctionalLocations',
                        Service: '/SAPAssetManager/Services/AssetManager.service',
                        QueryOptions: '$filter=false',
                        Properties: [],
                        KeyProperties: [],
                    },
                },
            },
        };
        extension.enterEditMode(json);
    }
}
