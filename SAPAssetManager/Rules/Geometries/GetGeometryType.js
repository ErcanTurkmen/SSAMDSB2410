
import libVal from '../Common/Library/ValidationLibrary';
import Logger from '../Log/Logger';

/**
 * Translate the geometry type if necessary from text to code
 * DB default values are: POINT = 1, POLYLINE = 2, POLYGON = 3, RECTANGLE = 4
 * @param {*} context 
 * @param {*} type 
 * @returns 
 */
export default function GetObjectGroup(context, type) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'GISMapParameters', [], "$filter=ParameterName eq 'GeometryType'").then(function(results) {
        if (results && results.length > 0) {
            try {
                let value = JSON.parse(results.getItem(0).ParameterValue);
                if (!libVal.evalIsEmpty(value[type])) {
                    return value[type];
                }
            } catch (error) {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMaps.global').getValue(), error);
                return '';
            }
        }
        return type; //Geometry already has a translated GeometryType value
    });
}
