
import locSvcMgr from '../LocationTracking/Services/ServiceManager';
import libCommon from '../Common/Library/CommonLibrary';
import ApplicationSettings from '../Common/Library/ApplicationSettings';

export default function GetCurrentGeometry(context, objectType) {
    if (!locSvcMgr.getInstance().isTrackingEnabled()) {
        return locSvcMgr.getInstance().enableTracking().then(function(isEnabled) {
            if (isEnabled) {
                return getCurrentLocation(context, objectType).finally(() => {
                    // atomic operation
                    locSvcMgr.getInstance().disableTracking();
                });
            }
            return false;
        });
    } else {
        return getCurrentLocation(context, objectType);
    }
}

function getCurrentLocation(context, objectType) {
    let pageProxy = context.getPageProxy();
    let locTitle = libCommon.getControlProxy(pageProxy, 'LocationEditTitle');
    context.showActivityIndicator(context.localizeText('getting_location_message'));
    return locSvcMgr.getInstance().getCurrentLocation().then((geoJson) => {
        if (geoJson) {
            const title = `${context.localizeText('point')}: ${geoJson.geometry.coordinates[0][0]}, ${geoJson.geometry.coordinates[0][1]}`;
            const geometryValue = '{\"x\":' + geoJson.geometry.coordinates[0][1] +
                ',\"y\":' + geoJson.geometry.coordinates[0][0] +
                ',\"spatialReference\":{\"wkid\":4326}}';
            locTitle.setValue(title);
            locTitle.getPageProxy().currentPage.editModeInfo = {
                geometryType: 'POINT',
                geometryValue: geometryValue,
            };
            libCommon.setStateVariable(context, 'GeometryObjectType', objectType);
            ApplicationSettings.setString(context, 'Geometry',
                JSON.stringify(locTitle.getPageProxy().currentPage.editModeInfo));
            return true;
        }
        return false;
    }).catch(() => {
        return false;
    }).finally(() => {
        context.dismissActivityIndicator();
    });
}
