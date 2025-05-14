import Logger from '../../Log/Logger';
/**
* This function gives the plant and it's description..
* @param {IClientAPI} context
*/
export default async function GetPlantDescription(context) {
   
    let plant = context.binding.Plant;

    const queryOptions = "$filter=Plant eq '" + plant +"'";
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Plants', [], queryOptions).then((result) => {
        if (result && result.length > 0) {
            return result.getItem(0).Plant + ' - ' + result.getItem(0).PlantDescription;          
        } else {
            return '';
        }
    }).catch(err => {
        Logger.error('Physical Inventory',  err);
        return '';
    });   
}

