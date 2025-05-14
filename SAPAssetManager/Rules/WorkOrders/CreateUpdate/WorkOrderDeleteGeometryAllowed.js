import libCommon from '../../Common/Library/CommonLibrary';
import libEval from '../../Common/Library/ValidationLibrary';
import IsGeometryEditAllowed from '../../Geometries/IsGeometryEditAllowed';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import { getGeometryData } from '../../Common/GetLocationInformation';

export default function WorkOrderDeleteGeometryAllowed(context) {
    if (!IsGeometryEditAllowed(context)) return false;

    // If we already have geometry data...
    if (context.getPageProxy().getClientData().geometry) {
        if (Object.keys(context.getPageProxy().getClientData().geometry).length > 0) {
            return libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        }
    // Otherwise, determine if we should have geometry data
    }
    return getGeometryData(context.getPageProxy(), 'MyWorkOrderHeader', null, false).then(geometryData => {
        if (libEval.evalIsEmpty(geometryData)) {
            // there could be geometry obtained from current location or parent object or from map
            let geometry = ApplicationSettings.getString(context, 'Geometry');
            let isLocal = (context.binding['@odata.readLink'])? libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']) : true;
            return (!libEval.evalIsEmpty(geometry) && isLocal);
        }
        return true;
    }, () => {
        // there could be geometry obtained from current location or parent object or from map
        let geometry = ApplicationSettings.getString(context, 'Geometry');
        let isLocal = (context.binding['@odata.readLink'])? libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']) : true;
        return (!libEval.evalIsEmpty(geometry) && isLocal);
    });
}
