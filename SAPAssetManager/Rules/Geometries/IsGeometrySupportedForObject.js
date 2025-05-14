import GeometryEditAllowed from './IsGeometryEditAllowed';
import libCommon from '../Common/Library/CommonLibrary';

/**
 * Is the target geometry type supported for this object?
 * Used to determine if user can manually select the current location point geometry when creating a new local object
 * @param {*} context 
 * @param {*} geometryType - '1' = Point, '2' = Polyline, '3' = Polygon
 * @returns 
 */
export default function IsGeometrySupportedForObject(context, geometryType) {
    if (GeometryEditAllowed(context) && geometryType) {
        const currentPage = libCommon.getCurrentPageName(context);
        let objectType = '';

        switch (currentPage) { //Maintain list of supported pages and their business object types
            case 'FunctionalLocationCreateUpdatePage':
                objectType = 'IFL';
                break;
            case 'EquipmentCreateUpdatePage':
                objectType = 'IEQ';
                break;
            case 'NotificationAddPage':
                objectType = 'NO1';
                break;
            case 'WorkOrderCreateUpdatePage':
                objectType = 'ORH';
                break;
            default:
                break;
        }

        if (objectType) {
            const query = "$filter=ObjectType eq '" + objectType + "' and GeometryType eq '" + geometryType + "'";

            return context.count('/SAPAssetManager/Services/AssetManager.service', 'GeometryTypes', query).then(function(count) {
                return (count > 0); //Is target geometry supported for this object type?
            });
        }
        return false; //Invalid source screen
    }
    return false; //Geometries not enabled or empty geometry target
}


