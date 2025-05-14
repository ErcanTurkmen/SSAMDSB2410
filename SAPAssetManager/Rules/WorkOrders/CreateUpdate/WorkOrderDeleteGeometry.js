import GeometryDeleteOnPress from '../../Geometries/GeometryDeleteOnPress';

export default function WorkOrderDeleteGeometry(context) {
    return GeometryDeleteOnPress(context, 'WOGeometries', 'MyWorkOrderGeometries');
}
