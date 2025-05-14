/**
* Get the Plant and storage location
* @param {IClientAPI} context
*/
import StockPlantDescription from './StockPlantDescription';
export default function PlantAndStorageLoc(context) {
    return StockPlantDescription(context).then(plant=>{
      return `${plant} / ${context.binding?.StorageLocation} - ${context.binding?.StorageLocationDesc}`;
    });
}
