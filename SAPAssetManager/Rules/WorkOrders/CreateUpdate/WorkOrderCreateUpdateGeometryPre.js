import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import GeometryFromMap from '../../Geometries/GeometryFromMap';
import WorkOrderCreateUpdateGeometryPost from './WorkOrderCreateUpdateGeometryPost';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';

export default function WorkOrderCreateUpdateGeometryPre(context, isGeometryUpdated) {
    let geometry = GeometryFromMap(context);
    if (geometry && !libVal.evalIsEmpty(geometry.geometryValue) && !isGeometryUpdated) {
        ApplicationSettings.setString(context, 'Geometry', JSON.stringify(geometry));
    }

    // this this method is called from map edit page, we need to refresh the current screen's location fields,
    // else post process the geometry update
    const pageName = libCommon.getCurrentPageName(context);
    if (pageName !== 'WorkOrderCreateMapDetailsPage' && pageName !== 'WorkOrderUpdateMapDetailsPage' && pageName !== 'WorkOrderCreateUpdatePage') {
        return WorkOrderCreateUpdateGeometryPost(context);
    }

    libCommon.setStateVariable(context, 'GeometryObjectType', 'WorkOrder');

    let locTitle = context.evaluateTargetPath('#Page:WorkOrderCreateUpdatePage/#Control:LocationEditTitle');
    let formCell = context.evaluateTargetPath('#Page:WorkOrderCreateUpdatePage/#Control:FormCellContainer');
    let value = JSON.parse(geometry.geometryValue);
    if (geometry.geometryType === 'POINT') {
        locTitle.setValue(`${context.localizeText(geometry.geometryType.toLowerCase())}': ${value.y.toFixed(7)}, ${value.x.toFixed(7)}`);
    } else {
        locTitle.setValue(context.localizeText(geometry.geometryType.toLowerCase()));
    }
    formCell.redraw();
}
