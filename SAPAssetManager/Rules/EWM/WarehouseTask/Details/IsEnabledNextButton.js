import { IsLast } from './TaskArray';
/**
 * 
 * @param {IClientAPI} context 
 */
export default function IsEnabledNextButton(context) {
    return !IsLast(context, context.binding.WarehouseTask);
}
