import Logger from '../../Log/Logger';
/**
* This function gives the storage location and it's description..
* @param {IClientAPI} context
*/
export default async function GetStorageLocationDescription(context) {
    let storageLocation = context.binding.StorLocation;
    let plant = context.binding.Plant;
    const queryOptions = "$filter=StorageLocation eq '" + storageLocation +"' and Plant eq '" + plant +"'";
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'StorageLocations', [], queryOptions).then((result) => {
        if (result && result.length > 0) {
            return result.getItem(0).StorageLocation + ' - ' + result.getItem(0).StorageLocationDesc;          
        } else {
            return '';
        }
    }).catch(err => {
        Logger.error('Physical Inventory',  err);
        return '';
    });   
}
