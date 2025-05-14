import libCommon from '../../Common/Library/CommonLibrary';
import { getGeometryData } from '../../Common/GetLocationInformation';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';

export default function FunctionalLocationDeleteGeometryAllowed(context) {
    // If we already have geometry data...
    if (context.getPageProxy().getClientData().geometry) {
        if (Object.keys(context.getPageProxy().getClientData().geometry).length > 0) {
            return libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        }
    }
    // Otherwise, determine if we should have geometry data
    return getGeometryData(context.getPageProxy(), 'MyFunctionalLocation', null, false).then(geometryData => {
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
