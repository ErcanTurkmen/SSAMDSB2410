import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import GeometryFromMap from '../../Geometries/GeometryFromMap';
import NotificationCreateUpdateGeometryPost from './NotificationCreateUpdateGeometryPost';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';

export default function NotificationCreateUpdateGeometryPre(context) {
    let geometry = GeometryFromMap(context);
    if (geometry && !libVal.evalIsEmpty(geometry.geometryValue)) {
        ApplicationSettings.setString(context, 'Geometry', JSON.stringify(geometry));
    }

    // If this method is called from map edit page, we need to refresh the current screen's location fields,
    // else post process the geometry update
    let pageName = libCommon.getCurrentPageName(context);
    if (pageName !== 'NotificationMapCreatePage' && pageName !== 'NotificationMapUpdatePage' && pageName !== 'NotificationAddPage') {
        return NotificationCreateUpdateGeometryPost(context);
    }

    libCommon.setStateVariable(context, 'GeometryObjectType', 'Notification');

    let locTitle = context.evaluateTargetPath('#Page:NotificationAddPage/#Control:LocationEditTitle');
    let formCell = context.evaluateTargetPath('#Page:NotificationAddPage/#Control:FormCellContainer');
    let value = JSON.parse(geometry.geometryValue);
    if (geometry.geometryType === 'POINT') {
        locTitle.setValue(context.localizeText(geometry.geometryType.toLowerCase()) + ': ' +
            value.y.toFixed(7) + ',' + value.x.toFixed(7));
    } else {
        locTitle.setValue(context.localizeText(geometry.geometryType.toLowerCase()));
    }
    formCell.redraw();
}
