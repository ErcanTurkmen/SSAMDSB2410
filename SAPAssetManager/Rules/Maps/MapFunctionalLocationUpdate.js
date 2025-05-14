
export default function MapFunctionalLocationUpdate(context) {
    const extension = context.getControl('MapExtensionControl')._control;
    if (extension) {
        const json = {
            EditModeConfig: {
                ObjectKey: context.binding.FuncLocIdIntern,
                EditModePanel: {
                    GeometryTypes: ['Polyline', 'Polygon'],
                    TitleText: 'action_update_floc',
                    SaveButtonText: 'save',
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
                    Action: '/SAPAssetManager/Rules/FunctionalLocation/CreateUpdate/FunctionalLocationCreateUpdateGeometryPre.js',
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
