
export default function MapEquipmentUpdate(context) {
    const extension = context.getControl('MapExtensionControl')._control;
    if (extension) {
        const json = {
            EditModeConfig: {
                ObjectKey: context.binding.EquipId,
                EditModePanel: {
                    GeometryTypes: ['Polyline', 'Polygon'],
                    TitleText: 'action_update_equip',
                    SaveButtonText: 'save',
                    Symbol: {
                        marker: 'MarkerAsset',
                        styleWidth: 24,
                        styleHeight: 24,
                        lineColor: 'A100C2',
                        fillColor: 'A100C233',
                        lineWidth: 2,
                        yOffset: 0,
                        xOffset: 0,
                    },
                },
                CallbackInfo: {
                    Action: '/SAPAssetManager/Rules/Equipment/CreateUpdate/EquipmentCreateUpdateGeometryPre.js',
                    Target: {
                        EntitySet: 'MyEquipments',
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
