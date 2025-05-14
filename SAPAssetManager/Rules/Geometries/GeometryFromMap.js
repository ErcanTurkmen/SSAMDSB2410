
export default function GeometryFromMap(context) {
    let type = '';
    let value = '';
    let extension;

    const mapControl = context.getControl && context.getControl('MapExtensionControl');
    if (mapControl) {
        extension = mapControl._control;
    }

    if (extension) {
        type = extension.getEditModeInfo().geometryType;
        value = extension.getEditModeInfo().geometryValue;
    } else if (context.getPageProxy().currentPage.editModeInfo) {
        type = context.getPageProxy().currentPage.editModeInfo.geometryType;
        value = context.getPageProxy().currentPage.editModeInfo.geometryValue;
    }

    return {
        geometryType: type,
        geometryValue: value,
    };
}
