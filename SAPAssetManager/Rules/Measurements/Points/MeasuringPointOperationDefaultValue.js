/**
* Default to last value if exist
* @param {IClientAPI} clientAPI
*/
import defaultValues from './MeasuringPointOperationDisplayValue';
export default function MeasuringPointOperationDefaultValue(clientAPI) {
    return defaultValues(clientAPI).slice(-1);
}
