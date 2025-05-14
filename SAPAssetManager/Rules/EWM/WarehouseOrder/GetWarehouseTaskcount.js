/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetWarehouseTaskcount(context) {
    if (context.binding.NoOfWHT) {
        return context.localizeText('x_wo_tasks', [Number(context.binding.NoOfWHT)]);
    } else {
        return context.localizeText('x_wo_tasks', [0]);
    }
}
