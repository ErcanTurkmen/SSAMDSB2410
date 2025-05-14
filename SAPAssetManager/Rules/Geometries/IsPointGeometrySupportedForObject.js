import isGeometrySupported from './IsGeometrySupportedForObject';

export default function IsPointGeometrySupportedForObject(context) {
    return isGeometrySupported(context, '1'); //Check for point geometry support
}
