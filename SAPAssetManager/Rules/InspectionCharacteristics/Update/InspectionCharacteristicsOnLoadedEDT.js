import { Filterable } from '../../Common/Filterable';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default async function InspectionCharacteristicsOnLoadedEDT(context) {
    //check from error archieve
    let filterable = new Filterable(context);
	context.getClientData().Filterable = filterable;
}
