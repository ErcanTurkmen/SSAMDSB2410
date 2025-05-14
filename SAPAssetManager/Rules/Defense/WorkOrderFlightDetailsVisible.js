import isDefenseEnabled from './isDefenseEnabled';
import Logger from '../Log/Logger';

/**
 * Determine if the Work Order Flight details fields should be visible
 * If defense feature is enabled and work order has a flight row, then display flight details
 * @param {IClientAPI} context
 */
export default async function WorkOrderFlightDetailsVisible(context) {
    try {
        let binding = (typeof context.getActionBinding === 'function') ? context.getActionBinding() || context.binding : context.binding;

        if (isDefenseEnabled(context) && binding) {
            let target = binding['@odata.readLink'] + '/Flight_Nav';
            const result = await context.count('/SAPAssetManager/Services/AssetManager.service', target, '');

            return (result > 0); //Return a boolean to indicate whether the flight data should be shown
        }
        return Promise.resolve(false);
    } catch (error) {
        Logger.error('WorkOrderFlightDetailsVisible', `Flight data read error: ${error}`);
        return Promise.resolve(false);
    }
}
