import Logger from '../../../SAPAssetManager/Rules/Log/Logger'; 
/**
 * Don't show '+' Button on PartsListView.page if the WorkOrder has a type listed in aOrderTypesToDisable
 */
export default function PartAddVisibility(clientAPI) {
	const aOrderTypesToDisable = ['SO11', 'SO22', 'SO26', 'SO12','SO16'];
	const sOrderType = clientAPI.getBindingObject().OrderType;
	return !aOrderTypesToDisable.includes(sOrderType);
}