import { IsFirst } from './TaskArray';
/**
 * 
 * @param {IClientAPI} context 
 */
export default function IsEnabledPreviousNextButton(context) {
    return !IsFirst(context, context.binding.WarehouseTask);
}
