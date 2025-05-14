import libCommon from '../../Common/Library/CommonLibrary';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import { getGeometryData } from '../../Common/GetLocationInformation';

export default function NotificationDeleteGeometryAllowed(context) {
    // If we already have geometry data...
    if (context.getPageProxy().getClientData().geometry) {
        if (Object.keys(context.getPageProxy().getClientData().geometry).length > 0) {
            return libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        }
    // Otherwise, determine if we should have geometry data
    }
    return getGeometryData(context.getPageProxy(), 'MyNotificationHeader', null, false).then(geometryData => {
        if (ValidationLibrary.evalIsEmpty(geometryData)) {
            // there could be geometry obtained from current location or parent object or from map
            let geometry = ApplicationSettings.getString(context, 'Geometry');
            let isLocal = (context.binding['@odata.readLink'])? libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']) : true;
            return (!ValidationLibrary.evalIsEmpty(geometry) && isLocal);
        }
        return true;
    }, () => {
        // there could be geometry obtained from current location or parent object or from map
        let geometry = ApplicationSettings.getString(context, 'Geometry');
        let isLocal = (context.binding['@odata.readLink'])? libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']) : true;
        return (!ValidationLibrary.evalIsEmpty(geometry) && isLocal);
    });
}
