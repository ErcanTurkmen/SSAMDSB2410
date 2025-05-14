/**
 * Gets the Material UOM
 */
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
export default function GetMaterialUOM(context, material, uom) {
    const query = "$filter=MaterialNum eq '" + material + "' and UOM eq '" + uom + "'";
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialUOMs', [], query).then(MaterialUOM => {
        if (!(ValidationLibrary.evalIsEmpty(MaterialUOM))) {
            return MaterialUOM.getItem(0);
        }
        return Promise.resolve();
    });
}

